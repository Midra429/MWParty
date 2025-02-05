import { useMemo } from 'react'
import { Link, Divider, cn } from '@heroui/react'
import { FilmIcon, SearchIcon } from 'lucide-react'
import { ncoParser } from '@midra/nco-parser'

import { VOD_KEYS } from '@/constants/vods'

import { webext } from '@/utils/webext'
import { mwpVods } from '@/mwp/vods'
import { useSettings } from '@/hooks/useSettings'
import { useMwpState } from '@/hooks/useMwpState'

const { name } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

export const Main: React.FC = () => {
  const [vods] = useSettings('settings:vods')

  const manual = useMwpState('manual')
  const playback = useMwpState('playback')

  const playbackVod = playback?.vods[0]

  const searchUrls = useMemo(() => {
    if (!playbackVod) return

    const vodKeys = VOD_KEYS.filter((key) => vods.includes(key))

    const keyword =
      ncoParser.extract(playbackVod.title).title || playbackVod.title

    return vodKeys.map((key) => {
      const mwpVod = mwpVods[key]
      const url = mwpVod.createSearchUrl(keyword)

      return [mwpVod.name, url] as const
    })
  }, [vods, playbackVod?.title])

  if (!manual || !playbackVod) {
    return null
  }

  const { name: vodName } = mwpVods[playbackVod.key]

  return (
    <>
      <div
        className={cn(
          'flex flex-col justify-center gap-6',
          'h-fit max-h-full max-w-full',
          'mx-auto p-8'
        )}
        style={{
          width: 500,
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
          <div className="flex flex-col gap-3">
            <div
              className={cn(
                'flex flex-row items-center gap-2',
                'text-large font-bold'
              )}
            >
              <FilmIcon className="size-6" strokeWidth={2.5} />
              <span>{vodName}</span>
            </div>

            <p
              className={cn(
                'line-clamp-3',
                !playbackVod.title &&
                  'text-foreground-400 dark:text-foreground-600'
              )}
            >
              {playbackVod.title || 'タイトルなし'}
            </p>
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <div
              className={cn(
                'flex flex-row items-center gap-2',
                'text-large font-bold'
              )}
            >
              <SearchIcon className="size-6" strokeWidth={2.5} />
              <span>検索</span>
            </div>

            <div className="flex flex-row flex-wrap gap-x-3 gap-y-2">
              {searchUrls?.map(([name, url]) => {
                return (
                  <div key={name}>
                    <Link
                      underline="hover"
                      showAnchorIcon
                      href={url}
                      isExternal
                    >
                      {name}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          <Divider />

          <div className="text-small text-foreground-400 dark:text-foreground-600">
            <p>
              <span className="font-bold">{vodName}</span>
              は設定で無効になっています。
            </p>

            <p>
              有効にして
              <span className="font-bold">「パーティーを開始」</span>
              または
              <span className="font-bold">「パーティーを再同期」</span>
              するか、
              <br />
              有効になっている他の動画配信サービスの視聴画面を開いて
              <span className="font-bold">「パーティーを開始」</span>
              してください。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
