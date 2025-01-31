import type { ButtonProps } from '@/components/Button'

import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { CopyIcon } from 'lucide-react'

import { Button } from '@/components/Button'

export type CopyRoomUrlButtonProps = Omit<
  ButtonProps,
  'children' | 'variant' | 'color' | 'startContent' | 'onPress'
> & {
  roomId: string | null
  hiddenIcon?: boolean
}

export const CopyRoomUrlButton: React.FC<CopyRoomUrlButtonProps> = ({
  roomId,
  hiddenIcon,
  ...props
}) => {
  const onPress = useCallback(async () => {
    if (!roomId) return

    await navigator.clipboard.writeText(
      `https://${import.meta.env.WXT_PARTYKIT_HOST_SHORT}/room/${roomId}`
    )

    toast.success('コピーしました')
  }, [roomId])

  return (
    <Button
      {...props}
      variant="flat"
      color="default"
      isDisabled={props.isDisabled || !roomId}
      startContent={!hiddenIcon && <CopyIcon />}
      onPress={onPress}
    >
      部屋URLをコピー
    </Button>
  )
}
