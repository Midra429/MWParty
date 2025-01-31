import type { ButtonProps } from '@/components/Button'
import type { PopconfirmProps } from '@/components/Popconfirm'

import { DoorClosedIcon, LockKeyholeIcon } from 'lucide-react'

import { mwpRoomProxy } from '@/proxy/mwpRoom/extension'
import { useStorage } from '@/hooks/useStorage'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { Popconfirm } from '@/components/Popconfirm'

export type LeaveOrCloseButtonProps = Omit<
  ButtonProps,
  'children' | 'variant' | 'color' | 'startContent' | 'onPress'
> & {
  popconfirmProps?: Omit<
    PopconfirmProps,
    'children' | 'title' | 'description' | 'okColor' | 'onOk'
  >
  hiddenIcon?: boolean
}

export const LeaveOrCloseButton: React.FC<LeaveOrCloseButtonProps> = ({
  popconfirmProps,
  hiddenIcon,
  ...props
}) => {
  const [myRoom] = useStorage('account:room')
  const joinedRoom = useMwpState('room')

  const isMyRoom = joinedRoom?.id === myRoom?.id
  const isDisabled = !joinedRoom

  return (
    <Popconfirm
      {...popconfirmProps}
      size={popconfirmProps?.size ?? props.size}
      title={isMyRoom ? '部屋を閉めますか？' : '部屋から出ますか？'}
      description={
        isMyRoom ? (
          '部屋に鍵をかけ、退室します。'
        ) : (
          <>
            <span className="font-bold">@{joinedRoom?.user.username}</span>
            <span>の部屋から退室します。</span>
          </>
        )
      }
      okColor="danger"
      onOk={() => mwpRoomProxy.leave()}
    >
      <Button
        {...props}
        variant="flat"
        color="danger"
        isDisabled={isDisabled || props.isDisabled}
        startContent={
          !hiddenIcon && (isMyRoom ? <LockKeyholeIcon /> : <DoorClosedIcon />)
        }
      >
        {isMyRoom ? '部屋を閉める' : '部屋を出る'}
      </Button>
    </Popconfirm>
  )
}
