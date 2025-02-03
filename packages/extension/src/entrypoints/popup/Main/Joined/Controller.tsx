import type { PressEvent } from '@react-types/shared'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Divider, cn } from '@heroui/react'
import { useOverflowDetector } from 'react-detectable-overflow'
import party from 'party-js'
import {
  PlayIcon,
  PauseIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  PartyPopperIcon,
  XIcon,
} from 'lucide-react'

import { formatDuration } from '@/utils/format'
import { webext } from '@/utils/webext'
import { settings } from '@/utils/settings/extension'
import { mwpVods } from '@/mwp/vods'
import { mwpState } from '@/mwp/state'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { Popconfirm } from '@/components/Popconfirm'
import { PanelItem } from '@/components/PanelItem'
import { Tooltip } from '@/components/Tooltip'

const StatusPlayback: React.FC = () => {
  const { ref, overflow } = useOverflowDetector()

  const playback = useMwpState('playback')

  const duration = useMemo(() => {
    return formatDuration(playback?.time ?? 0)
  }, [playback?.time])

  const [vodName, vodId, vodTitle] = useMemo(() => {
    const vod = playback?.vods[0]

    if (vod) {
      return [mwpVods[vod.key].name, vod.id, vod.title]
    }

    return []
  }, [playback?.vods])

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full flex-row items-center justify-between">
        <span
          className={cn(
            'mr-0.5 font-bold',
            !vodName && 'text-foreground-400 dark:text-foreground-600'
          )}
          title={vodId && `ID: ${vodId}`}
        >
          {vodName ?? '未選択'}
        </span>

        <div className="flex flex-row items-center gap-1 [&>svg]:size-3.5">
          {playback?.state === 'play' ? <PlayIcon /> : <PauseIcon />}

          <span>{duration}</span>
        </div>
      </div>

      <Tooltip size="sm" content={overflow ? vodTitle : undefined}>
        <span
          className={cn(
            'line-clamp-2 break-all text-mini',
            !vodTitle && 'text-foreground-400 dark:text-foreground-600'
          )}
          ref={ref}
        >
          {vodTitle || 'タイトルなし'}
        </span>
      </Tooltip>
    </div>
  )
}

export const Controller: React.FC = () => {
  const [currentTabId, setCurrentTabId] = useState<number>()

  const stateTabId = useMwpState('tabId')
  const mode = useMwpState('mode')
  const manual = useMwpState('manual')

  // パーティーを開始
  const startParty = useCallback(
    async ({ target }: PressEvent) => {
      if (currentTabId == null) return

      const rect = party.Rect.fromElement(target as HTMLElement)

      await mwpState.set('tabId', currentTabId)

      party.confetti(rect, {
        count: 40,
        spread: 15,
        size: 0.8,
      })
    },
    [currentTabId]
  )

  // パーティーを終了
  const endParty = useCallback(async () => {
    await mwpState.remove('tabId')
  }, [])

  // パーティーを再同期
  const reloadParty = useCallback(async () => {
    if (stateTabId === null) return

    const vods = await settings.get('settings:vods')
    const playback = await mwpState.get('playback')
    const playbackVod = playback?.vods.find((vod) => {
      return vods.includes(vod.key)
    })

    if (playbackVod) {
      const { key, id } = playbackVod

      await webext.tabs.update(stateTabId, {
        url: mwpVods[key].createUrl(id),
      })
    }
  }, [stateTabId])

  // パーティー中のタブ
  const movePartyTab = useCallback(async () => {
    if (stateTabId === null) return

    const tab = await webext.tabs.get(stateTabId)

    await webext.tabs.update(tab.id!, {
      active: true,
    })
    await webext.windows.update(tab.windowId!, {
      focused: true,
    })

    window.close()
  }, [stateTabId])

  useEffect(() => {
    webext
      .getCurrentActiveTab()
      .then((tab) => {
        if (tab?.id != null && tab.id !== webext.tabs.TAB_ID_NONE) {
          setCurrentTabId(tab.id)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <PanelItem
      classNames={{
        wrapper: 'size-full shrink',
        base: 'flex size-full flex-col',
      }}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            'flex flex-row items-center',
            'my-2 w-full shrink-0 px-2'
          )}
        >
          <StatusPlayback />
        </div>

        <Divider />
      </div>

      <div className="flex size-full flex-col justify-center">
        {currentTabId === stateTabId ? (
          // 現在のタブでパーティー中
          <>
            <div className="flex h-full flex-col justify-center">
              <p className="text-center text-tiny">
                現在のタブでパーティー中です
              </p>
            </div>

            <div className="flex flex-col gap-2 px-2 pb-2">
              {mode === 'guest' && (
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={!!manual}
                  startContent={<RefreshCwIcon />}
                  onPress={reloadParty}
                >
                  パーティーを再同期
                </Button>
              )}

              <Popconfirm
                size="sm"
                title="パーティを終了しますか？"
                description="再生状況の同期を停止します。"
                okColor="danger"
                onOk={endParty}
              >
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  startContent={<XIcon />}
                >
                  パーティーを終了
                </Button>
              </Popconfirm>
            </div>
          </>
        ) : (
          // パーティー参加前 or 別のタブでパーティー中
          <>
            <div className="flex h-full flex-col justify-center">
              <p className="whitespace-pre-wrap text-center text-tiny">
                {stateTabId != null
                  ? '別のタブでパーティー中です'
                  : 'パーティーを開始して\n再生状況を同期してください'}
              </p>
            </div>

            <div className="flex flex-col gap-2 px-2 pb-2">
              {stateTabId != null && (
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<ExternalLinkIcon />}
                  onPress={movePartyTab}
                >
                  パーティー中のタブ
                </Button>
              )}

              <Button
                size="sm"
                color="primary"
                startContent={<PartyPopperIcon />}
                isDisabled={currentTabId == null}
                onPress={startParty}
              >
                パーティーを開始
              </Button>
            </div>
          </>
        )}
      </div>
    </PanelItem>
  )
}
