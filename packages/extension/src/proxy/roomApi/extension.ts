import type { roomApi } from '@/api/room'

import { createProxy } from '@/utils/proxy-service/create'
import { sendMessage } from '@/utils/proxy-service/messaging/extension'

export const roomApiProxy = createProxy<typeof roomApi>('roomApi', sendMessage)
