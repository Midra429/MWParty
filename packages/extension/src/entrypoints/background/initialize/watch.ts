import type { MwpStateItems } from '@/mwp/state'

import { deepEqual } from 'fast-equals'

import { webext } from '@/utils/webext'
import { settings } from '@/utils/settings/extension'
import { setBadge } from '@/utils/extension/setBadge'
import { pingSignal } from '@/utils/extension/pingSignal'
import { sendMwpMessage } from '@/mwp/messaging'
import { mwpVods } from '@/mwp/vods'
import { mwpState } from '@/mwp/state'
import { mwpRoom } from '@/mwp/room'

export default () => {
  let stateTabId: MwpStateItems['tabId'] | null = null

  webext.tabs.onRemoved.addListener((tabId) => {
    if (tabId === stateTabId) {
      mwpState.remove('tabId')
    }
  })

  mwpState.watch('tabId', async (newTabId, oldTabId) => {
    if (newTabId !== null && newTabId !== webext.tabs.TAB_ID_NONE) {
      stateTabId = newTabId

      sendMwpMessage('content:activate', null, newTabId).catch(() => {})
    } else {
      stateTabId = null

      await mwpRoom.resetPlayback()
    }

    if (oldTabId !== null && oldTabId !== newTabId) {
      sendMwpMessage('content:deactivate', null, oldTabId).catch(() => {})
    }
  })

  mwpState.watch('ping', (ping) => {
    if (ping !== null) {
      const signal = pingSignal(ping)

      setBadge({
        color:
          (signal === 'high' && 'green') ||
          (signal === 'middle' && 'yellow') ||
          (signal === 'low' && 'red') ||
          'blue',
      })
    } else {
      setBadge({ color: 'blue' })
    }
  })

  mwpState.watch('presence', (presence) => {
    if (presence) {
      setBadge({
        text: presence.users.length.toString(),
      })
    } else {
      setBadge({ text: null })
    }
  })

  mwpState.watch('playback', async (newPlayback, oldPlayback) => {
    const mode = await mwpState.get('mode')

    if (mode === 'host') return

    if (
      newPlayback?.vods.length &&
      !deepEqual(newPlayback.vods, oldPlayback?.vods)
    ) {
      const vods = await settings.get('settings:vods')
      const playbackVod = newPlayback.vods.find((v) => vods.includes(v.key))

      let url: string | null = null

      if (playbackVod) {
        mwpState.set('manual', false)

        const { key, id } = playbackVod

        url = mwpVods[key].createUrl(id)
      } else {
        mwpState.set('manual', true)

        url = `https://${import.meta.env.WXT_PARTYKIT_HOST_SHORT}/manual`
      }

      try {
        if (stateTabId === null) {
          throw new Error()
        }

        // タブを更新
        await webext.tabs.update(stateTabId, { url })
      } catch {
        // 新しいタブで開く
        const tab = await webext.tabs.create({ url })

        mwpState.set('tabId', tab.id!)
      }
    }
  })

  settings.onChange('settings:vods', async (vods) => {
    const mode = await mwpState.get('mode')

    if (mode === 'host') return

    const playback = await mwpState.get('playback')

    const manual = !playback?.vods.some((v) => vods?.includes(v.key))

    mwpState.set('manual', manual)
  })
}
