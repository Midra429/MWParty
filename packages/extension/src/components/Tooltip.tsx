import type { TooltipPlacement } from '@heroui/react'

import { Tooltip as HeroUiTooltip } from '@heroui/react'

export type TooltipProps = React.PropsWithChildren<{
  size?: 'sm' | 'md' | 'lg'
  placement?: TooltipPlacement
  content?: React.ReactNode
}>

export const Tooltip: React.FC<TooltipProps> = ({
  size,
  placement,
  content,
  children,
}) => {
  return content ? (
    <HeroUiTooltip
      classNames={{
        base: 'pointer-events-none max-w-[90vw]',
        content: 'whitespace-pre-wrap',
      }}
      placement={placement}
      size={size}
      color="foreground"
      offset={5}
      closeDelay={0}
      content={content}
    >
      {children}
    </HeroUiTooltip>
  ) : (
    children
  )
}
