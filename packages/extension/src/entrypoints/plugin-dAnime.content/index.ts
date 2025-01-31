import type { VodKey } from '@/types/constants'

import { defineContentScript } from 'wxt/sandbox'

import { execPlugins } from '@/utils/extension/execPlugins'
import { mwpVodBases } from '@/mwp/vods/base'

import { skipSeekingEvent } from './skipSeekingEvent'
import { disablePopupPlayer } from './disablePopupPlayer'

const key: VodKey = 'dAnime'

export default defineContentScript({
  matches: mwpVodBases[key].matches,
  runAt: 'document_start',
  world: 'MAIN',
  main: () => {
    skipSeekingEvent()

    execPlugins(key, {
      disablePopupPlayer,
    })
  },
})
