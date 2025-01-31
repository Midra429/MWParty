import type { SettingsItems, SettingsKey } from '@/types/storage'

/** 設定のデフォルト値 */
export const SETTINGS_DEFAULT: SettingsItems = {
  // 全般
  'settings:theme': 'auto',
  'settings:showChangelog': true,

  // 動画配信サービス
  'settings:vods': ['youtube', 'niconico', 'tver'],

  // プラグイン
  'settings:plugins': ['dAnime:disablePopupPlayer'],
}

export const SETTINGS_DEFAULT_KEYS = Object.keys(
  SETTINGS_DEFAULT
) as SettingsKey[]
