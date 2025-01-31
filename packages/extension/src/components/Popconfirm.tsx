import type { PopoverProps, ButtonProps } from "@heroui/react"

import { useState, useCallback } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
  tv,
} from "@heroui/react"
import { InfoIcon } from 'lucide-react'

import { Button } from '@/components/Button'

export type PopconfirmProps = {
  children: React.ReactElement

  size?: PopoverProps['size']
  placement?: PopoverProps['placement']
  icon?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode

  okColor?: ButtonProps['color']
  okText?: React.ReactNode
  onOk: () => void | Promise<void>

  cancelColor?: ButtonProps['color']
  cancelText?: React.ReactNode
  onCancel?: () => void | Promise<void>
}

const popoverIcon = tv({
  defaultVariants: {
    color: 'default',
  },
  variants: {
    color: {
      default: 'fill-blue-600/10 text-blue-600',
      primary: 'fill-primary/10 text-primary',
      secondary: 'fill-secondary/10 text-secondary',
      success: 'fill-success/10 text-success',
      warning: 'fill-warning/10 text-warning',
      danger: 'fill-danger/10 text-danger',
    },
  },
})

export const Popconfirm: React.FC<PopconfirmProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onPressCancel = useCallback(async () => {
    if (props.onCancel) {
      const result = props.onCancel()

      if (result instanceof Promise) {
        await result
      }
    }

    setIsOpen(false)
  }, [props.onCancel])

  const onPressOk = useCallback(async () => {
    const result = props.onOk()

    if (result instanceof Promise) {
      await result
    }

    setIsOpen(false)
  }, [props.onOk])

  return (
    <Popover
      classNames={{
        content: [
          'flex flex-row items-start',
          'gap-2 p-4',
          props.size === 'sm' && 'gap-1.5 p-3',
          props.size === 'lg' && 'gap-2.5 p-5',
          'border-1 border-foreground-100',
        ],
      }}
      size={props.size}
      placement={props.placement}
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>{props.children}</PopoverTrigger>

      <PopoverContent>
        <div
          className={cn(
            'flex shrink-0 items-center',
            'h-7',
            props.size === 'sm' && 'h-6',
            props.size === 'lg' && 'h-7'
          )}
        >
          {props.icon || (
            <InfoIcon
              className={popoverIcon({ color: props.okColor })}
              size={
                {
                  sm: 20,
                  md: 24,
                  lg: 28,
                }[props.size ?? 'md']
              }
            />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col',
            'gap-3',
            props.size === 'sm' && 'gap-2',
            props.size === 'lg' && 'gap-4'
          )}
        >
          <span
            className={cn(
              'text-large',
              props.size === 'sm' && 'text-medium',
              props.size === 'lg' && 'text-xl',
              'font-semibold'
            )}
          >
            {props.title}
          </span>

          <span
            className={cn(
              'max-w-md text-medium',
              props.size === 'sm' && 'max-w-sm text-small',
              props.size === 'lg' && 'max-w-lg text-large',
              'text-foreground-400 dark:text-foreground-600'
            )}
          >
            {props.description}
          </span>

          <div className="ml-auto mt-1.5 flex flex-row gap-2">
            <Button
              size={props.size}
              variant="flat"
              color={props.cancelColor || 'default'}
              onPress={onPressCancel}
            >
              {props.cancelText || 'キャンセル'}
            </Button>

            <Button
              size={props.size}
              variant="solid"
              color={props.okColor || 'primary'}
              onPress={onPressOk}
            >
              {props.okText || 'OK'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
