import { utilsMessenger } from '@/utils/extension/messaging'
import { setBadge } from '@/utils/extension/setBadge'
import { webext } from '@/utils/webext'

export default () => {
  utilsMessenger.onMessage('restart', () => {
    webext.runtime.reload()
  })

  utilsMessenger.onMessage('openOptions', ({ sender }) => {
    if (sender.url && new URL(sender.url).pathname.startsWith('/redirect/')) {
      webext.tabs.update(sender.tab?.id, {
        url: webext.runtime.getURL('/options.html'),
        active: true,
      })
    } else {
      webext.runtime.openOptionsPage()
    }
  })

  utilsMessenger.onMessage('getCurrentTab', ({ sender }) => {
    return sender.tab ?? null
  })

  utilsMessenger.onMessage('setBadge', ({ sender, data }) => {
    return setBadge({
      tabId: sender.tab?.id,
      ...data,
    })
  })
}
