import type { RoomDetail } from 'backend/routes/api/room'

import { useEffect, useState } from 'react'
import { Avatar, Spinner, cn } from "@heroui/react"
import { HomeIcon, SettingsIcon } from 'lucide-react'

import { webext } from '@/utils/webext'
import { sendUtilsMessage } from '@/utils/extension/messaging'
import { roomApiProxy } from '@/proxy/roomApi/extension'
import { useStorage } from '@/hooks/useStorage'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { JoinOrOpenButton } from '@/components/mwp/JoinOrOpenButton'
import { LeaveOrCloseButton } from '@/components/mwp/LeaveOrCloseButton'

const { name } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

type RoomInfoProps = {
  roomId: string
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomId }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [room, setRoom] = useState<RoomDetail | null>(null)

  useEffect(() => {
    setIsLoading(true)

    roomApiProxy.detail(roomId).then((detail) => {
      setRoom(detail)
      setIsLoading(false)
    })
  }, [roomId])

  if (isLoading) {
    return <Spinner className="my-8" size="lg" />
  }

  return room ? (
    <>
      <div
        className={cn(
          'flex flex-row items-center gap-2',
          'text-large font-bold'
        )}
      >
        <HomeIcon className="size-6" strokeWidth={2.5} />
        <span>ホスト</span>
      </div>

      <div
        className={cn(
          'flex flex-row items-center gap-2.5',
          'w-full shrink-0 p-3',
          'border-2 border-foreground-200',
          'rounded-large',
          'overflow-hidden'
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
          size="lg"
          src={room.user.imageUrl}
        />

        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-large font-bold">
            {room.user.name || room.user.username}
          </span>

          <span className="truncate text-large text-foreground-400 dark:text-foreground-600">
            @{room.user.username}
          </span>
        </div>
      </div>

      <JoinOrOpenButton className="shrink-0" room={room} />
    </>
  ) : (
    <span className="mx-auto my-8 text-large">部屋が存在しません</span>
  )
}

export const Main: React.FC = () => {
  const [setupFinished] = useStorage('_setup_finished')
  const [myRoom] = useStorage('account:room')
  const joinedRoom = useMwpState('room')

  const roomId = location.pathname.split('/')[2]

  const isJoined = !!joinedRoom
  const isSameRoom = joinedRoom?.id === roomId
  const isMyRoom = joinedRoom?.id === myRoom?.id

  return (
    <>
      <div
        className={cn(
          'flex flex-col justify-center gap-6',
          'h-fit max-h-full max-w-full',
          'mx-auto p-8'
        )}
        style={{
          width: 400,
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="select-none"
            width={32}
            height={32}
            src={iconUrl}
            draggable={false}
          />

          <h1 className="ml-1 shrink-0 text-2xl font-bold">{name}</h1>
        </div>

        <div
          className={cn(
            'flex flex-col gap-4',
            'size-full p-6',
            'rounded-large',
            'bg-content1',
            'shadow-medium',
            'overflow-auto'
          )}
        >
          {setupFinished ? (
            isJoined ? (
              <>
                <p className="text-large">
                  {isSameRoom ? (
                    isMyRoom ? (
                      '部屋は開いています'
                    ) : (
                      '入室しています'
                    )
                  ) : (
                    <>
                      <span className="font-bold">
                        @{joinedRoom.user.username}
                      </span>
                      <span>の部屋でパーティー中です</span>
                    </>
                  )}
                </p>

                <LeaveOrCloseButton />
              </>
            ) : (
              <RoomInfo roomId={roomId} />
            )
          ) : (
            <>
              <p className="text-large">初期設定を完了してください</p>

              <Button
                color="primary"
                startContent={<SettingsIcon />}
                onPress={() => void sendUtilsMessage('openOptions', null)}
              >
                設定を開く
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
