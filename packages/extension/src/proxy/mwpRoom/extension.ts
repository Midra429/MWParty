import type { MwpRoom } from '@/mwp/room'

import { createProxy } from '@/utils/proxy-service/create'
import { sendMessage } from '@/utils/proxy-service/messaging/extension'

export type MwpRoomProxy = Omit<
  MwpRoom,
  'addEventListener' | 'removeEventListener' | 'removeAllEventListeners'
>

export const mwpRoomProxy = createProxy<MwpRoomProxy>('mwpRoom', sendMessage)
