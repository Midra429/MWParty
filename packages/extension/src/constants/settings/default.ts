import type { SettingsItems, SettingsKey } from '@/types/storage'

/** 設定のデフォルト値 */
export const SETTINGS_DEFAULT: SettingsItems = {
  // 全般
  'settings:theme': 'auto',
  'settings:showChangelog': true,

  // 動画配信サービス
  'settings:vods': ['youtube', 'niconico', 'tver'],

  // ホストとの最大遅延
  'settings:maxLatency': 'medium',

  // プラグイン
  'settings:plugins': ['dAnime:disablePopupPlayer'],
}

export const SETTINGS_DEFAULT_KEYS = Object.keys(
  SETTINGS_DEFAULT
) as SettingsKey[]

export const SETTINGS_MAX_LATENCY_SEC: Record<
  SettingsItems['settings:maxLatency'],
  number
> = {
  min: 0.5,
  low: 1.5,
  medium: 2.5,
  high: 3.5,
  max: 4.5,
}
