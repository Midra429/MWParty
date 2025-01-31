import type { Tables } from 'backend/types/supabase'
import type { VodKey, PluginKey } from '@/types/constants'
import type { MwpStateKey, MwpStateItems } from '@/mwp/state'

// 内部データ
export type InternalItems = {
  _version: number
  _setup_finished: boolean
}

export type InternalKey = keyof InternalItems

// アカウント情報
export type AccountItems = {
  'account:room': Tables<'rooms'>
}

export type AccountKey = keyof AccountItems

// 設定
export type SettingsItems = {
  // テーマ
  'settings:theme': 'auto' | 'light' | 'dark'

  // アップデート後に更新内容を表示
  'settings:showChangelog': boolean

  // 動画配信サービス
  'settings:vods': VodKey[]

  // プラグイン
  'settings:plugins': PluginKey[]
}

export type SettingsKey = keyof SettingsItems

// 状態
export type StateItems = {
  [key in MwpStateKey as `state:${key}`]: MwpStateItems[key]
}

export type StateKey = keyof StateItems

// ストレージ
export type StorageItems = InternalItems &
  AccountItems &
  SettingsItems &
  StateItems

export type StorageKey = keyof StorageItems

// エクスポート用
export type SettingsExportKey = InternalKey | SettingsKey
export type SettingsExportItems = Partial<InternalItems & SettingsItems>
