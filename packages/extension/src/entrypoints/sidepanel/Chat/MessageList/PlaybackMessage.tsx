import type { PlaybackReceiveMessage } from 'backend/schemas/message'

import { cn } from '@heroui/react'
import { useOverflowDetector } from 'react-detectable-overflow'
import { DotIcon, PlayIcon, PauseIcon, ClockIcon, FilmIcon } from 'lucide-react'

import { formatDate, formatDuration } from '@/utils/format'
import { mwpVods } from '@/mwp/vods'

const PlaybackMessageBase: React.FC<{
  Icon: React.FC<React.ComponentProps<'svg'>> | null
  content: React.ReactNode
  timestamp: number
}> = ({ Icon, content, timestamp }) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center',
        'mx-auto max-w-[85%]',
        'text-tiny text-foreground-400 dark:text-foreground-600'
      )}
    >
      {Icon && <Icon className="mr-1.5 size-4 shrink-0" strokeWidth={2.5} />}

      {content}

      <DotIcon className="size-4 shrink-0" />

      <span className="shrink-0">{formatDate(timestamp, 'h時mm分')}</span>
    </div>
  )
}

/**
 * 再生 / 一時停止 / 再生位置
 */
const StateMessage: React.FC<{
  message: Extract<PlaybackReceiveMessage, { time: number }>
}> = ({ message: { event, time, timestamp } }) => {
  let icon: React.FC<React.ComponentProps<'svg'>>
  let text: string

  switch (event) {
    case 'play': {
      icon = PlayIcon
      text = '再生開始'

      break
    }

    case 'pause': {
      icon = PauseIcon
      text = '一時停止'

      break
    }

    case 'seek': {
      icon = ClockIcon
      text = '再生位置'

      break
    }
  }

  return (
    <PlaybackMessageBase
      Icon={icon}
      content={
        <span>
          <span className="font-bold">{text}</span>
          <span className="ml-1">({formatDuration(time)})</span>
        </span>
      }
      timestamp={timestamp}
    />
  )
}

/**
 * 動画変更
 */
const ChangeMessage: React.FC<{
  message: Extract<PlaybackReceiveMessage, { event: 'change' }>
}> = ({ message: { vods, timestamp } }) => {
  const { ref, overflow } = useOverflowDetector()

  return vods.length ? (
    vods.map(({ key, id, title }, idx) => (
      <PlaybackMessageBase
        key={idx}
        Icon={FilmIcon}
        content={
          <div className="flex flex-col gap-0.5">
            <span className="font-bold" title={`ID: ${id}`}>
              {mwpVods[key].name}
            </span>

            {title && (
              <span
                className="line-clamp-2 break-all text-mini"
                title={overflow ? title : undefined}
                ref={ref}
              >
                {title}
              </span>
            )}
          </div>
        }
        timestamp={timestamp}
      />
    ))
  ) : (
    <PlaybackMessageBase
      Icon={FilmIcon}
      content={<span className="font-bold">動画未選択</span>}
      timestamp={timestamp}
    />
  )
}

export type PlaybackMessageProps = {
  message: PlaybackReceiveMessage
}

export const PlaybackMessage: React.FC<PlaybackMessageProps> = ({
  message,
}) => {
  switch (message.event) {
    case 'play':
    case 'pause':
    case 'seek':
      return <StateMessage message={message} />

    case 'change':
      return <ChangeMessage message={message} />
  }
}
