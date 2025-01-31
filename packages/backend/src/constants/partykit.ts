import type { PartyStorageItems } from '@/types/partykit'

export const PARTY_STORAGE_DEFAULT: Omit<
  PartyStorageItems,
  `history:${string}`
> = {
  presence: {
    users: [],
  },
  playback: {
    state: 'pause',
    time: 0,
    vods: [],
  },
}
