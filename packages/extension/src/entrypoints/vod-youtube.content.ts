import { defineContentScript } from 'wxt/sandbox'

import { logger } from '@/utils/logger'
import { checkVodEnable } from '@/utils/extension/checkVodEnable'
import { mwpVods } from '@/mwp/vods'
import { mwpState } from '@/mwp/state'
import { MwpController } from '@/mwp/controller'

type YtPageDataUpdatedEvent = CustomEvent<{
  pageType: 'watch' | 'shorts'
}>

const vod = mwpVods['youtube']

export default defineContentScript({
  matches: vod.matches,
  runAt: 'document_start',
  main: () => void main(),
})

const main = async () => {
  if (!(await checkVodEnable(vod.key))) return

  logger.log(`vod-${vod.key}.js`)

  const mwp = new MwpController(vod)

  window.addEventListener<any>(
    'yt-page-data-updated',
    async ({ detail }: YtPageDataUpdatedEvent) => {
      if (detail.pageType === 'watch') {
        const video = document.querySelector(vod.selectors.video)

        if (video) {
          const mode = await mwpState.get('mode')

          if (mode !== 'host' || video !== mwp.video) {
            mwp.initialize(video)
          }
        }
      } else if (!mwp.disposed) {
        mwp.dispose()
      }
    }
  )
}
