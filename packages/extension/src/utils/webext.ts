import type { WebExtBrowser } from 'wxt/browser'

import { browser } from 'wxt/browser'

const webext = browser as WebExtBrowser

webext.isChrome =
  import.meta.env.CHROME || import.meta.env.EDGE || import.meta.env.OPERA
webext.isFirefox = import.meta.env.FIREFOX
webext.isSafari = import.meta.env.SAFARI

webext.getCurrentActiveTab = async function (windowId) {
  const [tab] = await this.tabs.query({
    active: true,
    ...(windowId != null && windowId !== this.windows.WINDOW_ID_NONE
      ? { windowId }
      : { currentWindow: true }),
  })

  if (tab?.id != null && tab.id !== this.tabs.TAB_ID_NONE) {
    return tab as any
  }

  return null
}

// Firefox
if (webext.isFirefox) {
  webext.storage.local.getBytesInUse = async function (keys) {
    const values = await this.get(keys)

    let bytes = 0

    Object.entries(values).forEach(([key, value]) => {
      bytes += new Blob([
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      ]).size
    })

    return bytes
  }
}

export { webext }
