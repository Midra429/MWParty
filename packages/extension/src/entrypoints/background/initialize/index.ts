import { roomApi } from '@/api/room'
import { mwpState } from '@/mwp/state'

import registerProxies from './registerProxies'
import registerUtilsMessage from './registerUtilsMessage'
import watch from './watch'

export default async () => {
  registerProxies()
  registerUtilsMessage()

  await mwpState.clear()

  await roomApi.init()

  watch()
}
