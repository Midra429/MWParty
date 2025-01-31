import type { PresenceReceiveMessage } from 'backend/schemas/message'

import { Avatar, cn } from '@heroui/react'
import { DoorOpenIcon, DoorClosedIcon, DotIcon } from 'lucide-react'

import { formatDate } from '@/utils/format'

export type PresenceMessageProps = {
  message: PresenceReceiveMessage
}

export const PresenceMessage: React.FC<PresenceMessageProps> = ({
  message,
}) => {
  const Icon =
    (message.event === 'join' && DoorOpenIcon) ||
    (message.event === 'leave' && DoorClosedIcon)

  const text =
    (message.event === 'join' && '入室') ||
    (message.event === 'leave' && '退室')

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center',
        'mx-auto max-w-[85%]',
        'text-tiny text-foreground-400 dark:text-foreground-600'
      )}
    >
      {Icon && <Icon className="mr-1.5 size-4 shrink-0" />}

      <Avatar
        classNames={{
          base: [
            'mr-1.5 !size-5',
            'shrink-0 border-1 border-foreground-200',
            'opacity-80',
          ],
          img: 'select-none',
        }}
        imgProps={{
          draggable: false,
        }}
        src={message.user.imageUrl}
      />

      <span className="truncate font-bold">
        {message.user.name || `@${message.user.username}`}
      </span>

      <span className="shrink-0">が{text}</span>

      <DotIcon className="size-4 shrink-0" />

      <span className="shrink-0">
        {formatDate(message.timestamp, 'h時mm分')}
      </span>
    </div>
  )
}
