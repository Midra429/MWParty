import type { ButtonProps } from '@/components/Button'

import { useEffect, useState, useCallback } from 'react'
import { MessageSquareMoreIcon } from 'lucide-react'

import { webext } from '@/utils/webext'

import { Button } from '@/components/Button'

export type SidePanelButtonProps = Omit<
  ButtonProps,
  'children' | 'variant' | 'color' | 'startContent' | 'onPress'
> & {
  hiddenIcon?: boolean
}

export const SidePanelButton: React.FC<SidePanelButtonProps> = ({
  hiddenIcon,
  ...props
}) => {
  const [windowId, setWindowId] = useState<number>()

  useEffect(() => {
    webext.windows.getCurrent().then((window) => {
      setWindowId(window.id)
    })
  }, [])

  const onPress = useCallback(() => {
    if (webext.isChrome) {
      webext.sidePanel.getOptions({}).then(async (options) => {
        const enabled = !options.enabled

        await webext.sidePanel.setOptions({ enabled })

        if (enabled) {
          await webext.sidePanel.open({ windowId })
        }
      })
    } else {
      webext.sidebarAction.toggle()
    }
  }, [windowId])

  return (
    <Button
      {...props}
      variant="flat"
      color="default"
      startContent={!hiddenIcon && <MessageSquareMoreIcon />}
      onPress={onPress}
    >
      チャット
    </Button>
  )
}
