import { defineContentScript } from 'wxt/sandbox'

import { logger } from '@/utils/logger'
import { checkVodEnable } from '@/utils/extension/checkVodEnable'
import { mwpVods } from '@/mwp/vods'
import { MwpController } from '@/mwp/controller'

const vod = mwpVods['dAnime']

export default defineContentScript({
  matches: vod.matches,
  runAt: 'document_end',
  main: () => void main(),
})

const main = async () => {
  if (!(await checkVodEnable(vod.key))) return

  logger.log(`vod-${vod.key}.js`)

  const video = document.querySelector(vod.selectors.video)

  if (!video) return

  const mwp = new MwpController(vod)

  mwp.initialize(video)
}
