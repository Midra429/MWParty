import type { ButtonProps } from '@/components/Button'
import type { PopconfirmProps } from '@/components/Popconfirm'

import { useClerk, useUser } from '@clerk/chrome-extension'
import { LogOutIcon } from 'lucide-react'

import { mwpRoomProxy } from '@/proxy/mwpRoom/extension'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { Popconfirm } from '@/components/Popconfirm'

export type LogOutButtonProps = Omit<
  ButtonProps,
  'children' | 'variant' | 'color' | 'startContent' | 'onPress'
> & {
  popconfirmProps?: Omit<
    PopconfirmProps,
    'children' | 'title' | 'description' | 'okColor' | 'onOk'
  >
  hiddenIcon?: boolean
}

export const LogOutButton: React.FC<LogOutButtonProps> = ({
  popconfirmProps,
  hiddenIcon,
  ...props
}) => {
  const clerk = useClerk()
  const { isSignedIn, user } = useUser()

  const joinedRoom = useMwpState('room')

  return (
    <Popconfirm
      {...popconfirmProps}
      size={popconfirmProps?.size ?? props.size}
      title="ログアウトしますか？"
      description={
        <>
          <span className="font-bold">@{user?.username}</span>
          <span>からログアウトします。</span>
        </>
      }
      okColor="danger"
      onOk={async () => {
        await mwpRoomProxy.leave()

        await clerk.signOut()
      }}
    >
      <Button
        {...props}
        variant="flat"
        color="danger"
        isDisabled={props.isDisabled || !!joinedRoom || !isSignedIn}
        startContent={!hiddenIcon && <LogOutIcon />}
        onPress={undefined}
      >
        ログアウト
      </Button>
    </Popconfirm>
  )
}
