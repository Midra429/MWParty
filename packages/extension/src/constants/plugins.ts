import type { VodKey } from '@/types/constants'

/** プラグイン */
export const PLUGINS = {
  dAnime: [
    {
      id: 'disablePopupPlayer',
      title: 'ポップアップ無効化',
      description: '新しいタブでプレイヤーを開くようにする',
    },
  ],
} as const satisfies {
  [key in VodKey]?: {
    id: string
    title: string
    description?: string
  }[]
}
