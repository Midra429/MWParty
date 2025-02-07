import { useEffect, useState, useMemo } from 'react'
import { Image, Skeleton, Divider, cn } from '@heroui/react'
import { useOverflowDetector } from 'react-detectable-overflow'

import { ogpApi } from '@/api/ogp'
import { mwpState } from '@/mwp/state'
import { useMwpState } from '@/hooks/useMwpState'

export type UrlPreviewProps = {
  className?: string
  url: string
}

export const UrlPreview: React.FC<UrlPreviewProps> = ({ className, url }) => {
  const [isLoading, setIsLoading] = useState(true)

  const { ref, overflow } = useOverflowDetector()

  const ogp = useMwpState(`ogp:${url}`)

  const { origin, hostname } = useMemo(() => {
    return new URL(url)
  }, [url])

  const image = ogp?.image
  const favicon = ogp?.favicon
  const siteName = ogp?.site_name || hostname
  const title = ogp?.title || url

  useEffect(() => {
    mwpState.get(`ogp:${url}`).then((ogp) => {
      if (ogp) {
        setIsLoading(false)

        return
      }

      ogpApi.get(url).then(async (ogp) => {
        await mwpState.set(`ogp:${url}`, ogp)

        setIsLoading(false)
      })
    })
  }, [])

  return (
    <div
      className={cn(
        'flex flex-row',
        'h-[64px] w-full min-w-[180px] max-w-[300px]',
        'border-1 border-divider',
        'rounded-small',
        'overflow-hidden',
        className
      )}
    >
      {(isLoading || image) && (
        <>
          <div
            className={cn(
              'aspect-square h-full shrink-0',
              'bg-background bg-cover bg-center',
              'transition-background'
            )}
            style={{
              backgroundImage: image ? `url("${image}")` : undefined,
            }}
          />

          <Divider orientation="vertical" />
        </>
      )}

      <div
        className={cn(
          'flex flex-col justify-center gap-[2px]',
          'size-full p-[6px]',
          'bg-content2',
          'overflow-hidden'
        )}
      >
        {isLoading ? (
          <div className="flex h-[16px] flex-col justify-center">
            <Skeleton className="h-[14px] w-3/5 rounded-sm" />
          </div>
        ) : (
          <div className="flex h-[16px] flex-row items-center gap-1">
            <div
              className={cn(
                'flex items-center justify-center',
                'size-[14px] shrink-0',
                'rounded-sm',
                'bg-white'
              )}
            >
              <Image
                classNames={{
                  wrapper: 'size-[12px]',
                  img: 'size-full select-none rounded-sm object-cover',
                }}
                radius="none"
                draggable={false}
                src={favicon || `${origin}/favicon.ico`}
                fallbackSrc={`https://www.google.com/s2/favicons?domain=${origin}&sz=32`}
              />
            </div>

            <p
              className={cn(
                'truncate text-tiny',
                'text-foreground-400 dark:text-foreground-600'
              )}
            >
              {siteName}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-[32px] flex-col justify-center gap-[2px]">
            <Skeleton className="h-[14px] w-full rounded-sm" />
            <Skeleton className="h-[14px] w-4/5 rounded-sm" />
          </div>
        ) : (
          <p
            className="line-clamp-2 break-all text-tiny font-bold"
            title={(overflow && title) || undefined}
            ref={ref as any}
          >
            {title}
          </p>
        )}
      </div>
    </div>
  )
}
