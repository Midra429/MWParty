import { useEffect, useState, useMemo } from 'react'
import { Divider, Skeleton, cn } from '@heroui/react'
import { useOverflowDetector } from 'react-detectable-overflow'

import { getMetaData } from '@/utils/getMetaData'
import { mwpState } from '@/mwp/state'
import { useMwpState } from '@/hooks/useMwpState'

export type UrlPreviewProps = {
  className?: string
  url: string
}

export const UrlPreview: React.FC<UrlPreviewProps> = ({ className, url }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { ref, overflow } = useOverflowDetector()

  const meta = useMwpState(`meta:${url}`)

  const { origin, hostname } = useMemo(() => {
    return new URL(url)
  }, [url])

  const image = meta?.['og:image']
  const siteName = meta?.['og:site_name'] || hostname
  const title = meta?.['og:title'] || meta?.title

  useEffect(() => {
    mwpState.get(`meta:${url}`).then((meta) => {
      if (meta) {
        setIsLoading(false)

        return
      }

      getMetaData(url).then(async (meta) => {
        await mwpState.set(`meta:${url}`, meta)

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
              'aspect-square h-full',
              'shrink-0',
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
          'bg-content2'
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
                'aspect-square h-[14px]',
                'shrink-0',
                'rounded-sm',
                'bg-white bg-[length:12px] bg-center bg-no-repeat',
                'transition-background'
              )}
              style={{
                backgroundImage: `url("https://www.google.com/s2/favicons?domain=${origin}&sz=32")`,
              }}
            />

            <p
              className={cn(
                'line-clamp-1 text-tiny',
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
            title={overflow ? title : undefined}
            ref={ref as any}
          >
            {title || url}
          </p>
        )}
      </div>
    </div>
  )
}
