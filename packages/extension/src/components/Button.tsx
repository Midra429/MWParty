import type { AbstractView } from 'react'
import type { PressEvent } from '@react-types/shared'
import type { ButtonProps as HeroUiButtonProps } from '@heroui/react'

import { useState, useMemo, useCallback } from 'react'
import { Button as HeroUiButton, cn } from '@heroui/react'

const pressEventToMouseEvent = (
  evt: PressEvent
): React.MouseEvent<HTMLButtonElement, MouseEvent> => {
  const mouseEvent = {
    ...new MouseEvent('click'),
    target: evt.target,
    currentTarget: evt.target as HTMLButtonElement,
  }

  return {
    ...mouseEvent,
    view: mouseEvent.view as unknown as AbstractView,
    nativeEvent: mouseEvent,
    isDefaultPrevented: () => true,
    isPropagationStopped: () => true,
    persist: () => {},
  }
}

export interface ButtonProps extends HeroUiButtonProps {
  onPress?: (e: PressEvent) => void | Promise<void>
}

export const Button: React.FC<ButtonProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  const iconWrapperClassName = useMemo(() => {
    return cn(
      '[&>svg]:size-5',
      props.size === 'sm' && '[&>svg]:size-4',
      props.size === 'lg' && '[&>svg]:size-6'
    )
  }, [props.size])

  const onPress = useCallback(
    async (evt: PressEvent) => {
      if (!props.onPress && !props.onClick) return

      let result: any

      if (props.onPress) {
        result = props.onPress(evt)
      } else if (props.onClick) {
        result = props.onClick(pressEventToMouseEvent(evt))
      }

      if (result instanceof Promise) {
        setIsLoading(true)

        try {
          await result
        } finally {
          setIsLoading(false)
        }
      }
    },
    [props.onPress, props.onClick]
  )

  return (
    <HeroUiButton
      {...props}
      className={cn(props.className, iconWrapperClassName)}
      isLoading={props.isLoading || isLoading}
      onPress={onPress}
      onClick={undefined}
      startContent={
        props.isLoading || isLoading ? undefined : props.startContent
      }
      children={props.isIconOnly ? undefined : props.children}
    />
  )
}
