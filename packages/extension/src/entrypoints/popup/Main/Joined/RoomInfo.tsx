import { useMemo } from 'react'
import { Divider, cn } from '@heroui/react'
import { WifiIcon, WifiHighIcon, WifiLowIcon, HomeIcon } from 'lucide-react'

import { pingSignal } from '@/utils/extension/pingSignal'
import { useMwpState } from '@/hooks/useMwpState'

import { PanelItem } from '@/components/PanelItem'
import { User } from '@/components/mwp/User'
import { CopyRoomUrlButton } from '@/components/mwp/CopyRoomUrlButton'
import { LeaveOrCloseButton } from '@/components/mwp/LeaveOrCloseButton'

const StatusPing: React.FC = () => {
  const ping = useMwpState('ping')

  const signal = useMemo(() => {
    return pingSignal(ping)
  }, [ping])

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-1',
        signal === 'high' && 'text-success',
        signal === 'middle' && 'text-warning',
        signal === 'low' && 'text-danger',
        signal === null && 'text-foreground-400'
      )}
    >
      <div className="relative size-3.5 [&>svg]:absolute [&>svg]:size-full">
        <WifiIcon className="opacity-35" />

        {signal === 'high' && <WifiIcon />}
        {signal === 'middle' && <WifiHighIcon />}
        {signal === 'low' && <WifiLowIcon />}
      </div>

      <span className="mr-0.5">{signal ? `${ping}ms` : '接続中'}</span>
    </div>
  )
}

export const RoomInfo: React.FC = () => {
  const joinedRoom = useMwpState('room')

  return (
    <PanelItem
      classNames={{
        wrapper: 'h-full w-[45%] shrink-0',
        base: 'flex size-full flex-col',
      }}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            'flex flex-row items-center justify-between',
            'w-full p-2'
          )}
        >
          <div
            className={cn(
              'flex flex-row items-center justify-center gap-2',
              'pl-0.5',
              'text-small font-bold'
            )}
          >
            <HomeIcon className="size-4" strokeWidth={2.5} />
            <span>ホスト</span>
          </div>

          <StatusPing />
        </div>

        <Divider />
      </div>

      <div className="flex size-full flex-col gap-2 p-2">
        <div className="flex size-full flex-col justify-center">
          {joinedRoom && <User size="sm" user={joinedRoom.user} />}
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <CopyRoomUrlButton size="sm" roomId={joinedRoom?.id ?? null} />

          <LeaveOrCloseButton size="sm" />
        </div>
      </div>
    </PanelItem>
  )
}
