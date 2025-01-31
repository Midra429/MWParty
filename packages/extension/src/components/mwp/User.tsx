import type { ClerkUserPublic } from 'backend/types/clerk'

import { Avatar, cn } from '@heroui/react'

export type UserProps = {
  size: 'sm' | 'md' | 'lg'
  user: Partial<ClerkUserPublic> | null | undefined
}

export const User: React.FC<UserProps> = ({ size, user }) => {
  return (
    <div className="flex w-full">
      <div
        className={cn(
          'flex w-full flex-row items-center',
          'gap-1.5',
          size === 'md' && 'gap-2',
          size === 'lg' && 'gap-2.5'
        )}
      >
        <Avatar
          classNames={{
            base: 'shrink-0 border-1 border-foreground-200',
            img: 'select-none',
          }}
          imgProps={{
            draggable: false,
          }}
          size={size}
          src={user?.imageUrl}
        />

        <div
          className={cn(
            'flex size-full flex-col overflow-hidden',
            'text-tiny',
            size === 'md' && 'text-small',
            size === 'lg' && 'text-large'
          )}
        >
          <div className="flex h-full flex-row items-center">
            <span className="truncate font-bold leading-none">
              {user?.name || user?.username}
            </span>
          </div>

          <div className="flex h-full flex-row items-center">
            <span className="truncate leading-none text-foreground-400 dark:text-foreground-600">
              @{user?.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
