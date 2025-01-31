import type { VodKey, PluginKey, SettingsInitData } from '@/types/constants'

import {
  SunMoonIcon,
  SunIcon,
  MoonIcon,
  SlidersHorizontalIcon,
  BlocksIcon,
} from 'lucide-react'

import { VOD_KEYS } from '@/constants/vods'
import { PLUGINS } from '@/constants/plugins'

import { webext } from '@/utils/webext'
import { mwpVods } from '@/mwp/vods'

const { name } = webext.runtime.getManifest()

/** 設定画面の初期化データ */
export const SETTINGS_INIT_DATA: SettingsInitData = [
  {
    id: 'general',
    title: '全般',
    icon: SlidersHorizontalIcon,
    items: [
      {
        settingsKey: 'settings:theme',
        inputType: 'select',
        label: 'テーマ',
        description: 'ポップアップ、サイドパネル、設定の外観',
        options: [
          {
            label: '自動',
            value: 'auto',
            icon: SunMoonIcon,
          },
          {
            label: 'ライト',
            value: 'light',
            icon: SunIcon,
          },
          {
            label: 'ダーク',
            value: 'dark',
            icon: MoonIcon,
          },
        ],
      },
      {
        settingsKey: 'settings:vods',
        inputType: 'checkbox',
        label: '動画配信サービス',
        description: `選択した動画配信サービスで${name}を有効にします`,
        options: VOD_KEYS.map((key) => ({
          label: mwpVods[key].name,
          value: key,
        })),
      },
      {
        settingsKey: 'settings:showChangelog',
        inputType: 'toggle',
        label: '更新内容を表示',
        description: 'アップデート後に更新内容を新しいタブで開きます',
      },
    ],
  },
  {
    id: 'plugins',
    title: 'プラグイン',
    icon: BlocksIcon,
    items: Object.entries(PLUGINS).map(([key, value]) => ({
      settingsKey: 'settings:plugins',
      inputType: 'checkcard',
      label: mwpVods[key as VodKey].name,
      options: value.map((val) => ({
        label: val.title,
        description: 'description' in val ? val.description : undefined,
        value: `${key}:${val.id}` as PluginKey,
      })),
    })),
  },
]
