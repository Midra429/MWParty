import { defineBackground } from 'wxt/sandbox'

import { GITHUB_URL } from '@/constants'

import { logger } from '@/utils/logger'
import { webext } from '@/utils/webext'
import { settings } from '@/utils/settings/extension'

import initialize from './initialize'
import connection from './connection'
import requestPermissions from './requestPermissions'
import migration from './migration'

export default defineBackground({
  type: 'module',
  main: () => void main(),
})

const main = () => {
  logger.log('background.js')

  initialize()

  connection()

  // インストール・アップデート時
  webext.runtime.onInstalled.addListener(async ({ reason }) => {
    const { version } = webext.runtime.getManifest()

    // 権限をリクエスト
    requestPermissions()

    switch (reason) {
      // インストール
      case 'install': {
        if (import.meta.env.PROD) {
          // オプション
          webext.runtime.openOptionsPage()
        }

        break
      }

      // アップデート
      case 'update': {
        await migration()

        if (
          import.meta.env.PROD &&
          (await settings.get('settings:showChangelog'))
        ) {
          // リリースノート
          webext.tabs.create({
            url: `${GITHUB_URL}/releases/tag/v${version}`,
          })
        }

        break
      }
    }
  })

  if (webext.isChrome) {
    webext.sidePanel.setOptions({ enabled: false })
  }

  settings.get().then((value) => {
    logger.log('settings:', value)
  })
}
