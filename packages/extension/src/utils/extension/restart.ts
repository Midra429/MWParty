import { webext } from '@/utils/webext'
import { mwpState } from '@/mwp/state'

export const restart = async () => {
  const tabId = await mwpState.get('tabId')

  if (tabId !== null && tabId !== webext.tabs.TAB_ID_NONE) {
    await webext.tabs.remove(tabId)
  }

  webext.runtime.reload()
}
