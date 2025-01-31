import { cn, Divider } from '@heroui/react'
import { FilmIcon } from 'lucide-react'

import { webext } from '@/utils/webext'
import { useMwpState } from '@/hooks/useMwpState'

import { mwpVods } from '@/mwp/vods'

const { name } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

export const Main: React.FC = () => {
  const manual = useMwpState('manual')
  const playback = useMwpState('playback')

  const vod = playback?.vods[0]

  if (!manual || !vod) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-col justify-center gap-6',
          'h-fit max-h-full max-w-full',
          'mx-auto p-8'
        )}
        style={{
          width: 450,
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="select-none"
            width={32}
            height={32}
            src={iconUrl}
            draggable={false}
          />

          <h1 className="ml-1 shrink-0 text-2xl font-bold">{name}</h1>
        </div>

        <div
          className={cn(
            'flex flex-col gap-4',
            'size-full p-6',
            'rounded-large',
            'bg-content1',
            'shadow-medium',
            'overflow-auto'
          )}
        >
          <div
            className={cn(
              'flex flex-row items-center gap-2',
              'text-large font-bold'
            )}
          >
            <FilmIcon className="size-6" strokeWidth={2.5} />
            <span>{mwpVods[vod.key].name}</span>
          </div>

          <p
            className={cn(
              'line-clamp-3',
              !vod.title && 'text-foreground-400 dark:text-foreground-600'
            )}
          >
            {vod.title || 'タイトルなし'}
          </p>

          <Divider />

          <div className="text-small text-foreground-400 dark:text-foreground-600">
            <p>
              <span className="font-bold">「{mwpVods[vod.key].name}」</span>
              は設定で無効になっています。
            </p>

            <p>
              有効にして
              <span className="font-bold">「パーティーを開始」</span>
              または
              <span className="font-bold">「パーティーを再同期」</span>
              するか、
              <br />
              有効になっている動画配信サービスの視聴画面を開いて
              <span className="font-bold">「パーティーを開始」</span>
              してください。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
