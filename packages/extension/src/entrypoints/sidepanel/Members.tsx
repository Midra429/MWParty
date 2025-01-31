import { cn } from '@heroui/react'
import { HomeIcon, User2Icon } from 'lucide-react'

import { useMwpState } from '@/hooks/useMwpState'

import { User } from '@/components/mwp/User'

export const Members: React.FC = () => {
  const joinedRoom = useMwpState('room')
  const presence = useMwpState('presence')

  const hostUser = joinedRoom?.user
  const guestUsers = presence?.users.filter((user) => user.id !== hostUser?.id)

  return (
    <div
      className={cn('flex flex-col gap-3', 'size-full p-3', 'overflow-auto')}
    >
      <div className="flex shrink-0 flex-col gap-3">
        <div
          className={cn(
            'sticky top-0 z-10',
            'flex flex-row items-center justify-between',
            'p-2.5',
            'border-1 border-foreground-200',
            'rounded-medium',
            'bg-content1',
            'text-small'
          )}
        >
          <div
            className={cn('flex flex-row items-center gap-1.5', 'font-bold')}
          >
            <HomeIcon className="size-4" strokeWidth={2.5} />
            <span>ホスト</span>
          </div>

          <span className="mr-1 text-small text-foreground-400 dark:text-foreground-600">
            {hostUser ? 1 : 0}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {hostUser && <User size="md" user={hostUser} />}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <div
          className={cn(
            'sticky top-0 z-10',
            'flex flex-row items-center justify-between',
            'p-2.5',
            'border-1 border-foreground-200',
            'rounded-medium',
            'bg-content1',
            'text-small'
          )}
        >
          <div
            className={cn('flex flex-row items-center gap-1.5', 'font-bold')}
          >
            <User2Icon className="size-4" strokeWidth={2.5} />
            <span>ゲスト</span>
          </div>

          <span className="mr-1 text-small text-foreground-400 dark:text-foreground-600">
            {guestUsers?.length ?? 0}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {guestUsers?.map((user, idx) => {
            return <User key={idx} size="md" user={user} />
          })}
        </div>
      </div>
    </div>
  )
}
