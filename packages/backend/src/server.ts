import type * as Party from 'partykit/server'
import type { ClerkClient } from '@clerk/backend'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Env } from '@/types/env'
import type { PartyStorageItems, ConnectionState } from '@/types/partykit'
import type { ClerkUserPublic } from '@/types/clerk'
import type { Database } from '@/types/supabase'
import type { ReceiveMessage } from '@/schemas/message'

import { deepEqual } from 'fast-equals'
import { createClerkClient } from '@clerk/backend'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { MWP_WS_STATUS_CODE, MWP_WS_STATUS } from '@/constants/websocket'
import { PARTY_STORAGE_DEFAULT } from '@/constants/partykit'

import { merge } from '@/utils/merge'
import { queue } from '@/utils/queue'
import { uid } from '@/utils/uid'
import { isRoomId } from '@/utils/isRoomId'
import { SendMessage } from '@/schemas/message'

import worker from '@/worker'

/** 接続数上限 */
const MAX_CONNECTIONS = 30

let clerkClient: ClerkClient
let supabaseClient: SupabaseClient<Database>

const initClerkClient = (env: Env) => {
  clerkClient ??= createClerkClient({
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
    secretKey: env.CLERK_SECRET_KEY,
  })
}

const initSupabaseClient = (env: Env) => {
  supabaseClient ??= createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY
  )
}

export default class Server implements Party.Server {
  readonly HISTORY_MAX_SIZE = {
    PRESENCE: 25,
    PLAYBACK: 25,
    CHAT: 50,
  }

  readonly presence = {
    join: async (...connections: Party.Connection<ConnectionState>[]) => {
      if (!connections.length) return

      const values = await this.room.storage.get([
        'presence',
        'history:presence',
        'history:chat',
      ])

      // user
      const users: {
        [key: `user:${string}`]: ClerkUserPublic
      } = {}

      const presence =
        values.get('presence') ?? PARTY_STORAGE_DEFAULT['presence']
      const presenceHistory = values.get('history:presence') ?? []
      const chatHistory = values.get('history:chat') ?? []

      const timestamp = Date.now()

      for (const conn of connections) {
        const { userId } = conn.state!

        const clerkUser = await clerkClient.users.getUser(userId)

        const user: ClerkUserPublic = {
          id: userId,
          username: clerkUser.username!,
          name: clerkUser.firstName || null,
          imageUrl: clerkUser.imageUrl,
        }

        const receiveMsg: ReceiveMessage = {
          type: 'presence',
          event: 'join',
          id: uid(16),
          timestamp,
          user,
        }

        // user
        users[`user:${userId}`] = user

        // presence
        presence.users = presence.users.filter((user) => user.id !== userId)
        presence.users.push(user)

        // history:presence
        queue.add(presenceHistory, receiveMsg, this.HISTORY_MAX_SIZE.PRESENCE)

        // プロフィール更新
        ;[...presenceHistory, ...chatHistory].forEach((msg) => {
          if (msg.user.id === user.id) {
            msg.user = user
          }
        })

        this.room.broadcast(JSON.stringify(receiveMsg), [conn.id])
      }

      await this.room.storage.put({
        ...users,
        'presence': presence,
        'history:presence': presenceHistory,
        'history:chat': chatHistory,
      })
    },

    leave: async (...connections: Party.Connection<ConnectionState>[]) => {
      if (!connections.length) return

      if (connections.find((conn) => conn.state?.isOwner)) {
        await this.closeRoom(MWP_WS_STATUS_CODE.CLOSED)
      } else {
        const userIds = connections.map((v) => v.state?.userId)

        const values = await this.room.storage.get([
          ...userIds.map((id) => `user:${id}` as const),
          'presence',
          'history:presence',
        ])

        const presence =
          values.get('presence') ?? PARTY_STORAGE_DEFAULT['presence']
        const presenceHistory = values.get('history:presence') ?? []

        const timestamp = Date.now()

        for (const conn of connections) {
          if (!conn.state) continue

          const { userId } = conn.state

          const user = values.get(`user:${userId}`)!

          const receiveMsg: ReceiveMessage = {
            type: 'presence',
            event: 'leave',
            id: uid(16),
            timestamp,
            user,
          }

          // presence
          presence.users = presence.users.filter((user) => user.id !== userId)

          // history:presence
          queue.add(presenceHistory, receiveMsg, this.HISTORY_MAX_SIZE.PRESENCE)

          this.room.broadcast(JSON.stringify(receiveMsg), [conn.id])
        }

        await this.room.storage.put({
          'presence': presence,
          'history:presence': presenceHistory,
        })
      }
    },
  }

  constructor(readonly room: Party.Room) {
    const env = room.env as Env

    initClerkClient(env)
    initSupabaseClient(env)
  }

  static async onFetch(
    req: Party.Request,
    lobby: Party.FetchLobby,
    ctx: Party.ExecutionContext
  ): Promise<Response> {
    return worker.fetch(req as unknown as Request, lobby.env, ctx)
  }

  static async onBeforeConnect(
    req: Party.Request,
    lobby: Party.Lobby
  ): Promise<Party.Request | Response> {
    const env = lobby.env as Env

    initClerkClient(env)
    initSupabaseClient(env)

    if (!isRoomId(lobby.id)) {
      return new Response(null, {
        status: 400,
        statusText: '部屋IDの形式が無効です',
      })
    }

    const token = new URL(req.url).searchParams.get('token') ?? ''

    req.headers.append('Authorization', `Bearer ${token}`)

    // トークンを検証
    const reqState = await clerkClient.authenticateRequest(
      req as unknown as Request
    )

    if (!reqState.isSignedIn) {
      return new Response(null, {
        status: 401,
        statusText: 'ユーザー認証に失敗しました',
      })
    }

    const { userId } = reqState.toAuth()

    // 部屋情報を取得
    const { data: room } = await supabaseClient
      .from('rooms')
      .select()
      .eq('id', lobby.id)
      .single()

    if (!room) {
      return new Response(null, {
        status: 404,
        statusText: '部屋が存在しません',
      })
    }

    const isOwner = userId === room.user_id
    const isAdmin = userId === env.CLERK_ADMIN_USER_ID

    if (!room.is_open) {
      if (isOwner) {
        // 部屋を開ける
        const { error } = await supabaseClient
          .from('rooms')
          .update({ is_open: true })
          .eq('id', room.id)

        if (error) {
          return Response.json(error, {
            status: 500,
            statusText: '部屋の解錠に失敗しました',
          })
        }
      } else {
        return new Response(null, {
          status: 403,
          statusText: '部屋が施錠されています',
        })
      }
    }

    const state: ConnectionState = {
      userId,
      isOwner,
      isAdmin,
      lastActiveTime: Date.now(),
    }

    req.headers.set('x-mwp-state', JSON.stringify(state))

    return req
  }

  async onStart() {
    await this.room.storage.deleteAlarm()
    await this.room.storage.deleteAll()

    await this.room.storage.setAlarm(Date.now() + 30 * 1000)
  }

  async onConnect(
    connection: Party.Connection<ConnectionState>,
    ctx: Party.ConnectionContext
  ) {
    const total = [...this.room.getConnections()].length

    // 接続数の上限
    if (MAX_CONNECTIONS < total) {
      const code = MWP_WS_STATUS_CODE.CLOSED_ON_CAPACITY

      connection.close(code, MWP_WS_STATUS[code])

      return
    }

    const state = JSON.parse(ctx.request.headers.get('x-mwp-state')!)

    connection.setState(state)

    await this.presence.join(connection)
  }

  async onMessage(message: string, sender: Party.Connection<ConnectionState>) {
    if (message === 'ping') {
      sender.send('pong')

      sender.setState({
        ...sender.state!,
        lastActiveTime: Date.now(),
      })

      return
    }

    if (message === 'pong') {
      sender.setState({
        ...sender.state!,
        lastActiveTime: Date.now(),
      })

      return
    }

    try {
      const msg = SendMessage.parse(JSON.parse(message))

      const { userId, isOwner } = sender.state!
      const timestamp = Date.now()

      switch (msg.type) {
        case 'sync': {
          const items = await this.room.storage.get([
            'presence',
            'playback',
            'history:presence',
            'history:playback',
            'history:chat',
          ])

          const receiveMsg: ReceiveMessage = {
            ...msg,
            presence:
              items.get('presence') ?? PARTY_STORAGE_DEFAULT['presence'],
            playback:
              items.get('playback') ?? PARTY_STORAGE_DEFAULT['playback'],
            history: {
              presence: items.get('history:presence') ?? [],
              playback: items.get('history:playback') ?? [],
              chat: items.get('history:chat') ?? [],
            },
          }

          sender.send(JSON.stringify(receiveMsg))

          break
        }

        case 'playback': {
          if (!isOwner) break

          const values = await this.room.storage.get([
            'playback',
            'history:playback',
          ])

          const tmpPlayback: Partial<PartyStorageItems['playback']> = {}

          switch (msg.event) {
            case 'play':
            case 'pause': {
              tmpPlayback.state = msg.event

              break
            }

            case 'seek': {
              tmpPlayback.time = msg.time

              break
            }

            case 'change': {
              tmpPlayback.vods = msg.vods

              break
            }
          }

          // playback
          const oldPlayback =
            values.get('playback') ?? PARTY_STORAGE_DEFAULT['playback']
          const newPlayback = merge(oldPlayback, tmpPlayback)

          if (!deepEqual(oldPlayback, newPlayback)) {
            const receiveMsg: ReceiveMessage = {
              ...msg,
              id: uid(16),
              timestamp,
            }

            // history:playback
            const playbackHistory = values.get('history:playback') ?? []

            queue.add(
              playbackHistory,
              receiveMsg,
              this.HISTORY_MAX_SIZE.PLAYBACK
            )

            await this.room.storage.put({
              'playback': newPlayback,
              'history:playback': playbackHistory,
            })

            this.room.broadcast(JSON.stringify(receiveMsg))
          }

          break
        }

        case 'time': {
          if (!isOwner) break

          // playback
          const oldPlayback =
            (await this.room.storage.get('playback')) ??
            PARTY_STORAGE_DEFAULT['playback']
          const newPlayback = merge(oldPlayback, {
            time: msg.time,
          })

          if (!deepEqual(oldPlayback, newPlayback)) {
            const receiveMsg: ReceiveMessage = {
              ...msg,
              id: uid(16),
              timestamp,
            }

            await this.room.storage.put('playback', newPlayback)

            this.room.broadcast(JSON.stringify(receiveMsg))
          }

          break
        }

        case 'chat': {
          const user = (await this.room.storage.get(`user:${userId}`))!

          msg.body = msg.body.trim()

          const receiveMsg: ReceiveMessage = {
            ...msg,
            id: uid(16),
            timestamp,
            user,
          }

          // history:chat
          const chatHistory =
            (await this.room.storage.get('history:chat')) ?? []

          queue.add(chatHistory, receiveMsg, this.HISTORY_MAX_SIZE.CHAT)

          await this.room.storage.put('history:chat', chatHistory)

          this.room.broadcast(JSON.stringify(receiveMsg))

          break
        }
      }

      sender.setState({
        ...sender.state!,
        lastActiveTime: timestamp,
      })
    } catch (err) {
      console.error('message', err)
    }
  }

  async onClose(connection: Party.Connection<ConnectionState>) {
    console.log('close', connection.id)

    await this.presence.leave(connection)
  }

  async onError(connection: Party.Connection<ConnectionState>, error: Error) {
    console.error('error', connection.id, error.message)

    await this.presence.leave(connection)
  }

  async onAlarm() {
    console.log('alarm')

    try {
      const conns = [...this.room.getConnections<ConnectionState>()]

      if (!conns.length) return

      const now = Date.now()

      // タイムアウトした接続
      const timedoutConns = conns.filter((conn) => {
        return conn.state && 60 * 1000 < now - conn.state.lastActiveTime
      })

      const timedoutOwnerConn = timedoutConns.find(
        (conn) => conn.state?.isOwner
      )

      const code = MWP_WS_STATUS_CODE.CLOSED_ON_TIMEOUT

      if (timedoutOwnerConn) {
        timedoutOwnerConn.close(code, MWP_WS_STATUS[code])

        await this.presence.leave(timedoutOwnerConn)
      } else {
        timedoutConns.forEach((conn) => {
          conn.close(code, MWP_WS_STATUS[code])
        })

        await this.presence.leave(...timedoutConns)

        await this.room.storage.setAlarm(now + 30 * 1000)
      }
    } catch (err) {
      console.error('alarm', err)
    }
  }

  // 部屋を閉める
  async closeRoom(
    code?: (typeof MWP_WS_STATUS_CODE)[keyof typeof MWP_WS_STATUS_CODE]
  ) {
    // 部屋にいる人を退室させる
    ;[...this.room.getConnections<ConnectionState>()].forEach((conn) => {
      if (conn.state?.isOwner) return

      conn.close(code, code && MWP_WS_STATUS[code])
    })

    await supabaseClient
      .from('rooms')
      .update({ is_open: false })
      .eq('id', this.room.id)

    await this.room.storage.deleteAlarm()
    await this.room.storage.deleteAll()
  }
}

Server satisfies Party.Worker
