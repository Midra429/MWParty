import { Code, Divider, cn } from '@heroui/react'
import { HomeIcon, User2Icon } from 'lucide-react'

import { useStorage } from '@/hooks/useStorage'

import { PanelItem } from '@/components/PanelItem'
import { JoinOrOpenButton } from '@/components/mwp/JoinOrOpenButton'
import { CopyRoomUrlButton } from '@/components/mwp/CopyRoomUrlButton'

export const Unjoined: React.FC = () => {
  const [myRoom] = useStorage('account:room')

  return (
    <div className="flex size-full flex-row gap-2 p-2">
      <PanelItem
        classNames={{
          wrapper: 'h-full w-[45%] shrink',
          base: 'flex size-full shrink flex-col',
        }}
      >
        <div className="flex flex-col">
          <div
            className={cn(
              'flex flex-row items-center justify-center gap-2',
              'p-2',
              'text-small font-bold'
            )}
          >
            <HomeIcon className="size-4" strokeWidth={2.5} />
            <span>ホスト</span>
          </div>

          <Divider />
        </div>

        <div className="flex size-full flex-col">
          <div className="flex h-full flex-col justify-center">
            <p className="text-center text-tiny">
              部屋を開けると
              <br />
              ゲストが入室できます
            </p>
          </div>

          <div className="flex flex-col gap-2 px-2 pb-2">
            <CopyRoomUrlButton size="sm" roomId={myRoom?.id || null} />

            <JoinOrOpenButton size="sm" room={null} />
          </div>
        </div>
      </PanelItem>

      <PanelItem
        classNames={{
          wrapper: 'h-full w-[55%] shrink',
          base: 'flex size-full shrink flex-col',
        }}
      >
        <div
          className={cn(
            'flex flex-row items-center justify-center gap-2',
            'p-2',
            'text-small font-bold'
          )}
        >
          <User2Icon className="size-4" strokeWidth={2.5} />
          <span>ゲスト</span>
        </div>

        <Divider />

        <div className="flex size-full flex-col items-center justify-center gap-3">
          <p className="text-center text-tiny">
            この形式の部屋URLを開いて
            <br />
            部屋に入ってください
          </p>

          <Code size="sm">
            {import.meta.env.WXT_PARTYKIT_HOST_SHORT}/room/…
          </Code>
        </div>
      </PanelItem>
    </div>
  )
}
