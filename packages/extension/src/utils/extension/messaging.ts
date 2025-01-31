import type { Tabs } from 'wxt/browser'
import type { setBadge } from './setBadge'

import { defineExtensionMessaging } from '@webext-core/messaging'

// -> background

type ProtocolMap = {
  restart: (args?: null) => void

  openOptions: (args?: null) => void

  getCurrentTab: (args?: null) => Tabs.Tab | null

  setBadge: (
    args: Parameters<typeof setBadge>[0]
  ) => Awaited<ReturnType<typeof setBadge>>
}

export const utilsMessenger = defineExtensionMessaging<ProtocolMap>()

export const sendUtilsMessage: typeof utilsMessenger.sendMessage = async (
  ...args
) => {
  try {
    return await utilsMessenger.sendMessage(...args)
  } catch {
    return utilsMessenger.sendMessage(...args)
  }
}
