import type { PartyStorageItems } from 'backend/types/partykit'
import type {
  ReceiveMessage,
  ReceiveMessageMain,
} from 'backend/schemas/message'
import type { RoomDetail } from 'backend/routes/api/room'
import type { StorageItems } from '@/types/storage'
import type { StorageOnChangeCallback } from '@/utils/storage'
import type { MetaData } from '@/utils/getMetaData'

import { PARTY_STORAGE_DEFAULT } from 'backend/constants/partykit'
// import { queue } from 'backend/utils/queue'

import { merge } from '@/utils/merge'
import { storage } from '@/utils/storage/extension'

export type MwpStateItems = {
  tabId: number
  mode: 'guest' | 'host'
  manual: boolean
  room: RoomDetail
  ping: number
} & {
  [key: `meta:${string}`]: MetaData
} & Omit<PartyStorageItems, `user:${string}`>

export type MwpStateKey = keyof MwpStateItems

export const mwpState = {
  // HISTORY_MAX_SIZE: {
  //   PRESENCE: 250,
  //   PLAYBACK: 250,
  //   CHAT: 500,
  // },

  async recieve(message: ReceiveMessage) {
    switch (message.type) {
      case 'sync': {
        const values = await storage.get(
          'state:history:presence',
          'state:history:playback',
          'state:history:chat'
        )

        let presenceHistory = values['state:history:presence'] ?? []
        let playbackHistory = values['state:history:playback'] ?? []
        let chatHistory = values['state:history:chat'] ?? []

        presenceHistory.push(...message.history.presence)
        playbackHistory.push(...message.history.playback)
        chatHistory.push(...message.history.chat)

        presenceHistory = presenceHistory
          .filter((val, idx, ary) => {
            return ary.findIndex((v) => v.id === val.id) === idx
          })
          .sort((a, b) => a.timestamp - b.timestamp)
        playbackHistory = playbackHistory
          .filter((val, idx, ary) => {
            return ary.findIndex((v) => v.id === val.id) === idx
          })
          .sort((a, b) => a.timestamp - b.timestamp)
        chatHistory = chatHistory
          .filter((val, idx, ary) => {
            return ary.findIndex((v) => v.id === val.id) === idx
          })
          .sort((a, b) => a.timestamp - b.timestamp)

        // queue.filter(presenceHistory, this.HISTORY_MAX_SIZE.PRESENCE)
        // queue.filter(playbackHistory, this.HISTORY_MAX_SIZE.PLAYBACK)
        // queue.filter(chatHistory, this.HISTORY_MAX_SIZE.CHAT)

        await this.setAll({
          'presence': message.presence,
          'playback': message.playback,
          'history:presence': presenceHistory,
          'history:playback': playbackHistory,
          'history:chat': chatHistory,
        })

        break
      }

      case 'time': {
        const oldPlayback = await this.get('playback')

        // playback
        const newPlayback = merge<PartyStorageItems['playback']>(
          oldPlayback ?? PARTY_STORAGE_DEFAULT['playback'],
          {
            time: message.time,
          }
        )

        await this.set('playback', newPlayback)

        break
      }

      default: {
        return this.add(message)
      }
    }
  },

  async add(message: ReceiveMessageMain) {
    switch (message.type) {
      case 'presence': {
        const values = await storage.get(
          'state:presence',
          'state:history:presence'
        )

        const presence =
          values['state:presence'] ?? PARTY_STORAGE_DEFAULT['presence']
        const presenceHistory = values['state:history:presence'] ?? []

        // presence
        presence.users = presence.users.filter(
          (user) => user.id !== message.user.id
        )

        // history:presence
        // queue.add(presenceHistory, message, this.HISTORY_MAX_SIZE.PRESENCE)
        presenceHistory.push(message)

        if (message.event === 'join') {
          const chatHistory = (await storage.get('state:history:chat')) ?? []

          const user = message.user

          // presence
          presence.users.push(user)

          // プロフィール更新
          ;[...presenceHistory, ...chatHistory].forEach((msg) => {
            if (msg.user.id === user.id) {
              msg.user = user
            }
          })

          await this.set('history:chat', chatHistory)
        }

        await this.setAll({
          'presence': presence,
          'history:presence': presenceHistory,
        })

        break
      }

      case 'playback': {
        const values = await storage.get(
          'state:playback',
          'state:history:playback'
        )

        const tmpPlayback: Partial<PartyStorageItems['playback']> = {}

        switch (message.event) {
          case 'play':
          case 'pause': {
            tmpPlayback.state = message.event
          }

          case 'seek': {
            tmpPlayback.time = message.time

            break
          }

          case 'change': {
            tmpPlayback.vods = message.vods

            break
          }
        }

        // playback
        const oldPlayback =
          values['state:playback'] ?? PARTY_STORAGE_DEFAULT['playback']
        const newPlayback = merge(oldPlayback, tmpPlayback)

        // history:playback
        const playbackHistory = values['state:history:playback'] ?? []

        // queue.add(playbackHistory, message, this.HISTORY_MAX_SIZE.PLAYBACK)
        playbackHistory.push(message)

        await this.setAll({
          'playback': newPlayback,
          'history:playback': playbackHistory,
        })

        break
      }

      case 'chat': {
        const chatHistory = (await this.get('history:chat')) ?? []

        // queue.add(chatHistory, message, this.HISTORY_MAX_SIZE.CHAT)
        chatHistory.push(message)

        await this.set('history:chat', chatHistory)

        break
      }
    }
  },

  async get<Key extends MwpStateKey>(key: Key) {
    return storage.get(`state:${key}`)
  },

  async set<Key extends MwpStateKey>(
    key: Key,
    value: StorageItems[`state:${Key}`] | null
  ) {
    return storage.set(`state:${key}`, value)
  },

  async setAll(values: Partial<MwpStateItems>) {
    const keys = Object.keys(values) as MwpStateKey[]

    await Promise.all(
      keys.map((key) => {
        return typeof values[key] !== 'undefined' && this.set(key, values[key])
      })
    )
  },

  async remove<Keys extends [MwpStateKey, ...MwpStateKey[]]>(...keys: Keys) {
    if (!keys.length) return

    const stateKeys = keys.map((key) => `state:${key}` as const)

    return storage.remove(...stateKeys)
  },

  async clear() {
    const keys = Object.keys(await storage.get())

    const metaKeys = keys.filter((key) => {
      return key.startsWith('state:meta:')
    }) as `state:meta:${string}`[]

    if (metaKeys.length) {
      await storage.remove(...metaKeys)
    }

    await this.remove(
      'tabId',
      'mode',
      'manual',
      'room',
      'ping',

      'presence',
      'playback',
      'history:presence',
      'history:playback',
      'history:chat'
    )
  },

  onChange<Key extends MwpStateKey>(
    key: Key,
    callback: StorageOnChangeCallback<`state:${Key}`>
  ) {
    return storage.onChange(`state:${key}`, callback)
  },

  watch<Key extends MwpStateKey>(
    key: Key,
    callback: StorageOnChangeCallback<`state:${Key}`>
  ) {
    this.get(key).then((v) => callback(v, null))

    return this.onChange(key, callback)
  },
}
