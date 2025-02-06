import { useEffect, useState, useMemo } from 'react'
import { Divider, Image, Skeleton, cn } from '@heroui/react'

import { getMetaData } from '@/utils/getMetaData'
import { mwpState } from '@/mwp/state'
import { useMwpState } from '@/hooks/useMwpState'

export type UrlPreviewProps = {
  className?: string
  url: string
}

export const UrlPreview: React.FC<UrlPreviewProps> = ({ className, url }) => {
  const [isLoading, setIsLoading] = useState(true)

  const meta = useMwpState(`meta:${url}`)

  const { origin, hostname } = useMemo(() => {
    return new URL(url)
  }, [url])

  const siteName = meta?.['og:site_name'] || hostname
  const title = meta?.['og:title'] || meta?.title
  const isLargeImage = meta?.['twitter:card'] === 'summary_large_image'

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
        'flex',
        isLargeImage ? 'flex-col' : 'h-[64px] flex-row',
        'w-full min-w-[180px] max-w-[300px]',
        'border-1 border-divider',
        'rounded-small',
        'overflow-hidden',
        className
      )}
    >
      {(isLoading || meta?.['og:image']) && (
        <>
          <div
            className={cn(
              isLargeImage ? 'aspect-[2/1] w-full' : 'aspect-square h-full',

              'shrink-0',
              'bg-background bg-cover bg-center',
              'transition-background'
            )}
            style={{
              backgroundImage: meta?.['og:image']
                ? `url(${meta['og:image']})`
                : undefined,
            }}
          />

          <Divider orientation={isLargeImage ? 'horizontal' : 'vertical'} />
        </>
      )}

      <div
        className={cn(
          'flex flex-col justify-center gap-[2px]',
          'h-[62px] w-full p-[6px]',
          'bg-content2'
        )}
      >
        {isLoading ? (
          <Skeleton className="h-[16px] w-full rounded-sm" />
        ) : (
          <div className="flex h-[16px] flex-row items-center gap-1">
            <Image
              classNames={{
                wrapper: 'aspect-square size-[14px] shrink-0 bg-background',
                img: 'size-full object-cover',
              }}
              radius="none"
              src={`https://www.google.com/s2/favicons?domain=${origin}&sz=32`}
              draggable={false}
            />

            <p
              className={cn(
                'line-clamp-1 text-tiny',
                'text-foreground-400 dark:text-foreground-600'
              )}
              title={siteName}
            >
              {siteName}
            </p>
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-[16px] w-full rounded-sm" />
        ) : (
          <p
            className="line-clamp-2 break-all text-tiny font-bold"
            title={title}
          >
            {title || url}
          </p>
        )}
      </div>
    </div>
  )
}
