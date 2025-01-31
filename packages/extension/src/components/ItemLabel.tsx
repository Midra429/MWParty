import { tv } from "@heroui/react"

const itemLabel = tv({
  slots: {
    base: 'flex flex-col gap-1.5',
    title: 'text-foreground',
    description: [
      'text-foreground-400 dark:text-foreground-600',
      'whitespace-pre-wrap',
    ],
  },
  variants: {
    size: {
      sm: {
        title: 'text-small',
        description: 'text-tiny',
      },
      md: {
        title: 'text-medium',
        description: 'text-small',
      },
      lg: {
        title: 'text-large',
        description: 'text-medium',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type ItemLabelProps = {
  className?: string
  title: React.ReactNode
  description?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const ItemLabel: React.FC<ItemLabelProps> = (props) => {
  const slots = itemLabel({ size: props.size })

  return (
    <div
      className={slots.base({
        className: props.className,
      })}
    >
      <span className={slots.title()}>{props.title}</span>

      {props.description && (
        <span className={slots.description()}>{props.description}</span>
      )}
    </div>
  )
}
