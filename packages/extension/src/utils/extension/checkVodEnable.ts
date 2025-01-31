import type { VodKey } from '@/types/constants'

import { settings } from '@/utils/settings/extension'

export const checkVodEnable = async (key: VodKey) => {
  const vods = await settings.get('settings:vods')

  return vods.includes(key)
}
