import type { VodKey } from '@/types/constants'

import { webext } from '@/utils/webext'
import { mwpRoom } from '@/mwp/room'

export type PortMessageToContent = {
  type: 'ping'
}

export type PortMessageToBackground =
  | {
      type: 'pong'
    }
  | {
      type: 'vod'
      key: VodKey
      id: string
      title: string
    }
  | {
      type: 'play' | 'pause' | 'seek' | 'time'
      time: number
    }

export default () => {
  webext.runtime.onConnect.addListener((port) => {
    const tabId = port.sender?.tab?.id
    const windowId = port.sender?.tab?.windowId

    if (
      typeof tabId !== 'number' ||
      typeof windowId !== 'number' ||
      tabId === webext.tabs.TAB_ID_NONE ||
      windowId === webext.windows.WINDOW_ID_NONE
    ) {
      return
    }

    const postMessage = (message: PortMessageToContent) => {
      port.postMessage(message)
    }

    switch (port.name) {
      case 'content': {
        let pingIntervalId: NodeJS.Timeout | undefined
        let pingTimeoutId: NodeJS.Timeout | undefined

        const sendPing = () => {
          postMessage({ type: 'ping' })

          pingTimeoutId = setTimeout(disposePort, 5000)
        }

        const recievePong = () => {
          clearTimeout(pingIntervalId)
          clearTimeout(pingTimeoutId)

          pingIntervalId = setTimeout(sendPing, 5000)
        }

        const onPortMessage = (message: unknown) => {
          const msg = message as PortMessageToBackground

          switch (msg.type) {
            case 'pong': {
              recievePong()

              break
            }

            case 'vod': {
              mwpRoom.send({
                type: 'playback',
                event: 'change',
                vods: [
                  {
                    key: msg.key,
                    id: msg.id,
                    title: msg.title,
                  },
                ],
              })

              break
            }

            case 'play':
            case 'pause':
            case 'seek': {
              mwpRoom.send({
                type: 'playback',
                event: msg.type,
                time: msg.time,
              })

              break
            }

            case 'time': {
              mwpRoom.send({
                type: 'time',
                time: msg.time,
              })

              break
            }
          }
        }

        const disposePort = () => {
          clearTimeout(pingIntervalId)
          clearTimeout(pingTimeoutId)

          port.onDisconnect.removeListener(disposePort)
          port.onMessage.removeListener(onPortMessage)

          port.disconnect()

          mwpRoom.resetPlayback()
        }

        port.onDisconnect.addListener(disposePort)
        port.onMessage.addListener(onPortMessage)

        sendPing()

        break
      }
    }
  })
}
