import { registerProxy } from '@/utils/proxy-service/register'
import { onMessage } from '@/utils/proxy-service/messaging/extension'

import { ncoApi } from '@midra/nco-api'
import { roomApi } from '@/api/room'
import { mwpRoom } from '@/mwp/room'

export default () => {
  registerProxy('ncoApi', ncoApi, onMessage)
  registerProxy('roomApi', roomApi, onMessage)
  registerProxy('mwpRoom', mwpRoom, onMessage)
}
