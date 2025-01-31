import { defineContentScript } from 'wxt/sandbox'

import { logger } from '@/utils/logger'
import { checkVodEnable } from '@/utils/extension/checkVodEnable'
import { mwpVods } from '@/mwp/vods'
import { MwpController } from '@/mwp/controller'

const vod = mwpVods['primeVideo']

export default defineContentScript({
  matches: vod.matches,
  runAt: 'document_end',
  main: () => void main(),
})

const main = async () => {
  if (!(await checkVodEnable(vod.key))) return

  logger.log(`vod-${vod.key}.js`)

  const mwp = new MwpController(vod)

  const obs = new MutationObserver(() => {
    if (
      !mwp.disposed &&
      !(document.body.contains(mwp.video) && mwp.video?.offsetParent)
    ) {
      mwp.dispose()
    } else if (mwp.disposed) {
      const video = document.querySelector(vod.selectors.video)

      if (video?.offsetParent) {
        mwp.initialize(video)
      }
    }
  })

  obs.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  })
}
