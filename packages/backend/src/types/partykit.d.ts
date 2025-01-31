import type {
  DurableObjectStorage,
  DurableObjectGetOptions,
  DurableObjectPutOptions,
} from '@cloudflare/workers-types'
import type { TypedMap } from '@/types/typed-map'
import type { ClerkUserPublic } from '@/types/clerk'
import type { SyncReceiveMessage } from '@/schemas/message'

export type PartyStorageItems = {
  [key: `user:${string}`]: ClerkUserPublic
} & {
  'presence': SyncReceiveMessage['presence']
  'playback': SyncReceiveMessage['playback']

  'history:presence': SyncReceiveMessage['history']['presence']
  'history:playback': SyncReceiveMessage['history']['playback']
  'history:chat': SyncReceiveMessage['history']['chat']
}

export type PartyStorageKey = keyof PartyStorageItems

export type PartyStorageHistoryKey =
  Extract<PartyStorageKey, `history:${string}`> extends `history:${infer K}`
    ? K
    : never

declare module 'partykit/server' {
  export interface Storage extends DurableObjectStorage {
    get<Key extends PartyStorageKey>(
      key: Key,
      options?: DurableObjectGetOptions
    ): Promise<PartyStorageItems[Key] | undefined>
    get<Keys extends PartyStorageKey[]>(
      keys: Keys,
      options?: DurableObjectGetOptions
    ): Promise<TypedMap<Pick<PartyStorageItems, Keys[number]>>>
    put<Key extends PartyStorageKey>(
      key: Key,
      value: PartyStorageItems[Key],
      options?: DurableObjectPutOptions
    ): Promise<void>
    put(
      entries: Partial<PartyStorageItems>,
      options?: DurableObjectPutOptions
    ): Promise<void>
    delete(
      key: PartyStorageKey,
      options?: DurableObjectPutOptions
    ): Promise<boolean>
    delete(
      keys: PartyStorageKey[],
      options?: DurableObjectPutOptions
    ): Promise<number>
  }
}

export type ConnectionState = {
  userId: string
  isOwner: boolean
  isAdmin: boolean
  lastActiveTime: number
}
