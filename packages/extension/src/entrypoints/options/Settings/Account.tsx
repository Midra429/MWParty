import type { ClerkProviderProps } from '@clerk/chrome-extension'

import { cn } from "@heroui/react"
import { UserProfile } from '@clerk/chrome-extension'

import { useMwpState } from '@/hooks/useMwpState'

import { LeaveOrCloseButton } from '@/components/mwp/LeaveOrCloseButton'

const appearance: ClerkProviderProps['appearance'] = {
  elements: {
    rootBox: {
      width: '100%',
      height: '100%',
    },
    cardBox: {
      'flexDirection': 'column',
      'width': '100%',
      'height': '100%',

      '& > .cl-navbar': {
        display: 'none',
      },
    },
    navbarMobileMenuRow: {
      display: 'flex',
    },
    footer: {
      display: 'flex',
    },
  },
}

export const Account: React.FC = () => {
  const joinedRoom = useMwpState('room')

  return joinedRoom ? (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-8',
        'size-full p-6',
        'bg-content1'
      )}
    >
      <span className="text-large">パーティー中は変更できません</span>

      <LeaveOrCloseButton />
    </div>
  ) : (
    <UserProfile appearance={appearance} />
  )
}
