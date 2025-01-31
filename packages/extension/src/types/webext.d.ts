import type { Tabs } from 'wxt/browser'

declare module 'wxt/browser' {
  namespace Manifest {
    interface WebExtensionManifest extends ManifestBase {
      side_panel?: WebExtensionManifestSidePanelType
    }

    interface WebExtensionManifestSidePanelType {
      default_path: string
    }
  }

  namespace Storage {
    interface StorageArea {
      /**
       * 1 つ以上のアイテムで使用されているスペースの量（バイト単位）を取得します。
       *
       * @param keys 合計使用量を取得する単一のキーまたはキーのリスト。\
       * リストが空の場合は 0 が返されます。\
       * `null` を渡して、すべての保存容量の合計使用量を取得します。
       * @returns ストレージで使用されている容量（バイト単位）。
       */
      getBytesInUse(keys?: string | string[] | null): Promise<number>
    }
  }

  namespace SidePanel {
    interface GetPanelOptions {
      tabId?: number
    }

    interface OpenOptions {
      tabId?: number
      windowId?: number
    }

    interface PanelOptions {
      enabled?: boolean
      path?: string
      tabId?: number
    }

    interface PanelBehavior {
      openPanelOnActionClick?: boolean
    }

    interface Static {
      getOptions(options: GetPanelOptions): Promise<PanelOptions>

      getPanelBehavior(): Promise<PanelBehavior>

      open(options: OpenOptions): Promise<void>

      setOptions(options: PanelOptions): Promise<void>

      setPanelBehavior(behavior: PanelBehavior): Promise<void>
    }
  }

  type WebExtBrowser = AugmentedBrowser & {
    sidePanel: SidePanel.Static

    isChrome: boolean
    isFirefox: boolean
    isSafari: boolean

    getCurrentActiveTab(
      windowId?: number
    ): Promise<(Tabs.Tab & { id: number }) | null>
  }
}
