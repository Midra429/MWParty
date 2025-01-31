import type { ClerkUserPublic } from '@/types/clerk'

import z from 'zod'

import { VOD_KEYS } from 'extension/constants/vods'
import { CHAT_MAX_LENGTH } from '@/constants/schema'

// Sync (Send)
export const SyncSendMessage = z.object({
  type: z.literal('sync'),
})

// Playback (Send)
export const PlaybackStateSendMessage = z.object({
  type: z.literal('playback'),
  event: z.union([
    z.literal('play'), // 再生中
    z.literal('pause'), // 一時停止
    z.literal('seek'), // 再生位置変更
  ]),
  time: z.number().safe().nonnegative(),
})

export const PlaybackChangeSendMessage = z.object({
  type: z.literal('playback'),
  event: z.literal('change'), // 動画変更
  vods: z.array(
    z.object({
      key: z.union([
        z.literal(VOD_KEYS[0]),
        z.literal(VOD_KEYS[1]),
        ...VOD_KEYS.slice(2).map((key) => z.literal(key)),
      ]),
      id: z.string(),
      title: z.string(),
    })
  ),
})

export const PlaybackSendMessage = z.union([
  PlaybackStateSendMessage,
  PlaybackChangeSendMessage,
])

// Time (Send)
export const TimeSendMessage = z.object({
  type: z.literal('time'),
  time: z.number().safe().nonnegative(),
})

// Chat (Send)
export const ChatSendMessage = z.object({
  type: z.literal('chat'),
  body: z.string().refine(
    (val) => {
      const len = [...val].length
      return 1 <= len && len <= CHAT_MAX_LENGTH
    },
    { message: `1文字以上、${CHAT_MAX_LENGTH}文字以下に収めてください` }
  ),
})

// All (Send)
export const SendMessage = z.union([
  PlaybackSendMessage,
  TimeSendMessage,
  ChatSendMessage,
  SyncSendMessage,
])

// types
export type PlaybackStateSendMessage = z.infer<typeof PlaybackStateSendMessage>
export type PlaybackChangeSendMessage = z.infer<
  typeof PlaybackChangeSendMessage
>
export type PlaybackSendMessage = z.infer<typeof PlaybackSendMessage>
export type TimeSendMessage = z.infer<typeof TimeSendMessage>
export type ChatSendMessage = z.infer<typeof ChatSendMessage>
export type SyncSendMessage = z.infer<typeof SyncSendMessage>
export type SendMessage = z.infer<typeof SendMessage>

export type PlaybackVod = PlaybackChangeSendMessage['vods'][number]

// Receive Base
export type ReceiveMessageBase = {
  id: string
  timestamp: number
}

// Presence (Receive)
export type PresenceReceiveMessage = ReceiveMessageBase & {
  type: 'presence'
  event: 'join' | 'leave'
  user: ClerkUserPublic
}

// Playback (Receive)
export type PlaybackReceiveMessage = ReceiveMessageBase & PlaybackSendMessage

// Time (Receive)
export type TimeReceiveMessage = ReceiveMessageBase & TimeSendMessage

// Chat (Receive)
export type ChatReceiveMessage = ReceiveMessageBase &
  ChatSendMessage & {
    user: ClerkUserPublic
  }

// Sync (Receive)
export type SyncReceiveMessage = SyncSendMessage & {
  presence: {
    users: ClerkUserPublic[]
  }
  playback: {
    state: 'play' | 'pause'
    time: number
    vods: PlaybackVod[]
  }
  history: {
    presence: PresenceReceiveMessage[]
    playback: PlaybackReceiveMessage[]
    chat: ChatReceiveMessage[]
  }
}

// All (Receive)
export type ReceiveMessageMain =
  | PresenceReceiveMessage
  | PlaybackReceiveMessage
  | ChatReceiveMessage

export type ReceiveMessage =
  | ReceiveMessageMain
  | SyncReceiveMessage
  | TimeReceiveMessage
