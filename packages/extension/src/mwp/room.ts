import type { Clerk } from '@clerk/clerk-js'
import type { WebSocketEventMap } from 'partysocket/ws'
import type { ReceiveMessage, SendMessage } from 'backend/schemas/message'
import type { RoomDetail } from 'backend/routes/api/room'

import PartySocket from 'partysocket'

import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage/extension'
import { getClerkClient } from '@/utils/clerk'
import { roomApi } from '@/api/room'
import { mwpState } from '@/mwp/state'

export class MwpRoom {
  #user: Clerk['user'] | null = null
  #room: RoomDetail | null = null
  #socket: PartySocket | null = null

  #pingIntervalId: NodeJS.Timeout | null = null
  #pingTimeoutId: NodeJS.Timeout | null = null
  #pingTimestamp: number | null = null

  #listeners = {
    handleEvent(evt) {
      // @ts-ignore
      this[evt.type]?.(evt)
    },

    open: async (evt) => {
      logger.debug('socket open')

      this.#pingTimestamp = Date.now()

      this.sendRaw('ping')
      this.send({ type: 'sync' })
    },

    message: async (evt) => {
      const now = Date.now()

      if (evt.data === 'ping') {
        this.sendRaw('pong')

        return
      }

      if (evt.data === 'pong') {
        if (this.#pingIntervalId !== null) {
          clearTimeout(this.#pingIntervalId)

          this.#pingIntervalId = null
        }
        if (this.#pingTimeoutId !== null) {
          clearTimeout(this.#pingTimeoutId)

          this.#pingTimeoutId = null
        }

        if (this.#pingTimestamp) {
          const ping = now - this.#pingTimestamp

          await mwpState.set('ping', ping)
        }

        this.#pingIntervalId = setTimeout(() => {
          this.#pingTimestamp = Date.now()

          this.sendRaw('ping')

          this.#pingTimeoutId = setTimeout(async () => {
            await mwpState.remove('ping')
          }, 5000)
        }, 5000)

        return
      }

      const message = JSON.parse(evt.data) as ReceiveMessage

      // 自分自身のメッセージ
      if (message.type === 'sync') {
        Object.values(message.history)
          .flat()
          .forEach((message) => {
            if (
              message.type !== 'playback' &&
              message.user.id === this.#user?.id
            ) {
              message.user._isOwn = true
            }
          })
      } else if ('user' in message && message.user.id === this.#user?.id) {
        message.user._isOwn = true
      }

      logger.debug('socket recieve', message)

      await mwpState.recieve(message)
    },

    close: (evt) => {
      logger.debug('socket close', evt.code, evt.reason)

      this.leave()
    },

    error: (evt) => {
      logger.debug('socket error', evt.error)

      this.leave()
    },
  } satisfies EventListenerObject & {
    [type in keyof WebSocketEventMap]?: (evt: WebSocketEventMap[type]) => void
  }

  async join(id?: string) {
    logger.log('join', id)

    // 退室
    await this.leave()

    // Clerk
    const clerkClient = await getClerkClient()
    const token = await clerkClient.session?.getToken()

    if (!token) return false

    // 部屋情報
    const room = await roomApi.detail(id, token)

    if (!room) return false

    const myRoom = await storage.get('account:room')

    // state
    await mwpState.setAll({
      mode: room.id === myRoom?.id ? 'host' : 'guest',
      room,
    })

    this.#user = clerkClient.user

    this.#room = room

    this.#socket = new PartySocket({
      host: import.meta.env.WXT_PARTYKIT_HOST,
      room: room.id,
      query: { token },
      maxRetries: 10,
    })

    this.#socket.addEventListener('open', this.#listeners)
    this.#socket.addEventListener('message', this.#listeners)
    this.#socket.addEventListener('close', this.#listeners)
    this.#socket.addEventListener('error', this.#listeners)

    logger.log('joined', room.id)

    return true
  }

  async leave() {
    if (this.#room) {
      logger.log('leave', this.#room.id)
    }

    if (this.#socket) {
      this.#socket.removeEventListener('open', this.#listeners)
      this.#socket.removeEventListener('message', this.#listeners)
      this.#socket.removeEventListener('close', this.#listeners)
      this.#socket.removeEventListener('error', this.#listeners)

      this.#socket.close()
    }

    if (this.#pingIntervalId !== null) {
      clearTimeout(this.#pingIntervalId)

      this.#pingIntervalId = null
    }
    if (this.#pingTimeoutId !== null) {
      clearTimeout(this.#pingTimeoutId)

      this.#pingTimeoutId = null
    }

    this.#user = null
    this.#room = null
    this.#socket = null
    this.#pingIntervalId = null
    this.#pingTimeoutId = null
    this.#pingTimestamp = null

    await mwpState.clear()
  }

  send(message: SendMessage) {
    if (this.#socket) {
      this.#socket.send(JSON.stringify(message))

      logger.debug('socket send', message)
    }
  }

  sendRaw(message: string) {
    this.#socket?.send(message)
  }

  async resetPlayback() {
    const mode = await mwpState.get('mode')

    if (mode === 'host') {
      const playback = await mwpState.get('playback')

      if (playback) {
        if (playback.state === 'play') {
          mwpRoom.send({
            type: 'playback',
            event: 'pause',
            time: 0,
          })
        } else if (playback.time) {
          mwpRoom.send({
            type: 'time',
            time: 0,
          })
        }

        if (playback.vods.length) {
          mwpRoom.send({
            type: 'playback',
            event: 'change',
            vods: [],
          })
        }
      }
    }
  }
}

/**
 * 部屋管理
 * @description ※バックグラウンド専用
 */
export const mwpRoom = new MwpRoom()
