import type { PlaybackVod } from 'backend/schemas/message'

import { defineExtensionMessaging } from '@webext-core/messaging'

type ProtocolMap = {
  'content:activate': (args?: null) => boolean
  'content:deactivate': (args?: null) => boolean
  'content:getVodDetail': (args?: null) => Promise<PlaybackVod | undefined>
}

const messenger = defineExtensionMessaging<ProtocolMap>()

export const onMwpMessage = messenger.onMessage

export const sendMwpMessage: typeof messenger.sendMessage = async (...args) => {
  try {
    return await messenger.sendMessage(...args)
  } catch {
    return messenger.sendMessage(...args)
  }
}
