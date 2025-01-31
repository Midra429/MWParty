import { defineContentScript } from 'wxt/sandbox'

import { logger } from '@/utils/logger'
import { sendUtilsMessage } from '@/utils/extension/messaging'
import { roomApiProxy } from '@/proxy/roomApi/extension'

export default defineContentScript({
  matches: [`https://${import.meta.env.WXT_PARTYKIT_HOST}/redirect/*`],
  runAt: 'document_start',
  main: () => void main(),
})

const main = async () => {
  logger.log('redirect.js')

  const type = location.pathname.split('/')[2]

  switch (type) {
    case 'afterSignUp':
    case 'afterSignIn': {
      await roomApiProxy.init()

      break
    }
  }

  sendUtilsMessage('openOptions', null)
}
