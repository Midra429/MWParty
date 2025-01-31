import type { RoomDetail } from 'backend/routes/api/room'
import type { ButtonProps } from '@/components/Button'

import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { DoorOpenIcon, LockKeyholeOpenIcon } from 'lucide-react'

import { sendUtilsMessage } from '@/utils/extension/messaging'
import { mwpState } from '@/mwp/state'
import { mwpRoomProxy } from '@/proxy/mwpRoom/extension'
import { useStorage } from '@/hooks/useStorage'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'

export type JoinOrOpenButtonProps = Omit<
  ButtonProps,
  'children' | 'variant' | 'color' | 'startContent' | 'onPress'
> & {
  room: RoomDetail | null
  hiddenIcon?: boolean
}

export const JoinOrOpenButton: React.FC<JoinOrOpenButtonProps> = ({
  room,
  hiddenIcon,
  ...props
}) => {
  const [myRoom] = useStorage('account:room')
  const joinedRoom = useMwpState('room')

  const isMyRoom = !room || room.id === myRoom?.id
  const isDisabled = !!joinedRoom || (!isMyRoom && !room.is_open)

  const onPress = useCallback(async () => {
    const success = await mwpRoomProxy.join(room?.id)

    if (success) {
      toast.success(isMyRoom ? '部屋を開けました' : '入室しました')

      if (!isMyRoom) {
        const tab = await sendUtilsMessage('getCurrentTab', null)

        if (tab?.id != null && tab.id !== -1) {
          await mwpState.set('tabId', tab.id)
        }
      }
    } else {
      toast.error(
        isMyRoom ? '部屋を開けるのに失敗しました' : '入室に失敗しました'
      )
    }
  }, [room?.id, isMyRoom])

  return (
    <Button
      {...props}
      variant="solid"
      color="primary"
      isDisabled={isDisabled || props.isDisabled}
      startContent={
        !hiddenIcon && (isMyRoom ? <LockKeyholeOpenIcon /> : <DoorOpenIcon />)
      }
      onPress={onPress}
    >
      {isMyRoom ? '部屋を開ける' : '部屋に入る'}
    </Button>
  )
}
