import { Avatar, cn } from "@heroui/react"
import { useClerk, useUser } from '@clerk/chrome-extension'
import { User2Icon } from 'lucide-react'

import { Button } from '@/components/Button'
import { LogOutButton } from '@/components/mwp/LogOutButton'

export const LoggedInAccount: React.FC = () => {
  const clerk = useClerk()
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-evenly gap-8',
        'size-full p-6',
        'overflow-y-auto'
      )}
    >
      <div className="flex flex-col items-center">
        <h2 className="my-4 text-2xl font-bold">ログイン中のアカウント</h2>

        <div
          className={cn(
            'flex flex-col items-center',
            'text-medium text-foreground-400 dark:text-foreground-600'
          )}
        >
          <p>プロフィール変更は下の「アカウント情報」から</p>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-col items-center gap-4">
        <Avatar
          classNames={{
            base: [
              '!size-32',
              'border-1 border-foreground-200',
              'shadow-medium',
            ],
            img: 'select-none',
          }}
          imgProps={{
            draggable: false,
          }}
          src={user.imageUrl}
        />

        <div className="flex flex-col items-center overflow-hidden">
          <span className="truncate text-xl font-bold">
            {user.firstName || user.username}
          </span>

          <span className="truncate text-large text-foreground-400 dark:text-foreground-600">
            @{user.username}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Button
          variant="flat"
          startContent={<User2Icon />}
          onPress={() => clerk.openUserProfile()}
        >
          アカウント情報
        </Button>

        <LogOutButton />
      </div>
    </div>
  )
}
