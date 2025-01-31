import { cn } from '@heroui/react'
import { useUser } from '@clerk/chrome-extension'

import { SidePanelButton } from '@/components/SidePanelButton'
import { User } from '@/components/mwp/User'

export const Footer: React.FC = () => {
  const { user } = useUser()

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between gap-2',
        'w-full shrink-0 p-2',
        'border-t-1 border-foreground-200',
        'bg-content1'
      )}
    >
      <div className="flex w-full flex-row justify-start overflow-hidden">
        <User
          size="sm"
          user={{
            id: user?.id,
            username: user?.username!,
            name: user?.firstName,
            imageUrl: user?.imageUrl,
            _isOwn: true,
          }}
        />
      </div>

      <div className="flex shrink-0 flex-row justify-end gap-2 overflow-hidden">
        <SidePanelButton size="sm" radius="full" />
      </div>
    </div>
  )
}
