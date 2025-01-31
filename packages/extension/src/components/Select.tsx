import type {
  SlotsToClasses,
  SelectProps as HeroUiSelectProps,
  SelectSlots,
} from '@heroui/react'

import { useMemo } from 'react'
import {
  Select as HeroUiSelect,
  SelectItem as HeroUiSelectItem,
  SelectSection as HeroUiSelectSection,
  tv,
} from '@heroui/react'

export type SelectProps = HeroUiSelectProps

const select = tv({
  slots: {
    base: 'items-center justify-between gap-5',
    label: 'shrink-0 p-0',
    mainWrapper: 'transition-colors',
    trigger: 'border-1 border-divider shadow-none',
    innerWrapper: [
      '[&:has(>svg)]:gap-2',
      '[&>svg]:shrink-0',
      '[&>svg]:text-foreground-500',
      '[&>svg]:dark:text-foreground-600',
    ],
    selectorIcon: '',
    spinner: '',
    value: 'flex flex-row items-center justify-center gap-2',
    listboxWrapper: '',
    listbox: '',
    popoverContent: 'border-1 border-foreground-100',
    helperWrapper: '',
    description: [
      'whitespace-pre-wrap',
      'text-foreground-400 dark:text-foreground-600',
    ],
    errorMessage: '',
  } satisfies SlotsToClasses<SelectSlots>,
  variants: {
    size: {
      sm: {
        label: 'text-small',
        description: 'text-tiny',
      },
      md: {
        label: 'text-medium',
        description: 'text-small',
      },
      lg: {
        label: 'text-large',
        description: 'text-medium',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const Select: React.FC<SelectProps> = (props) => {
  const classNames = useMemo(() => {
    const slots = select({ size: props.size })
    const slotKeys = Object.keys(slots) as SelectSlots[]

    return Object.fromEntries(
      slotKeys.map((key) => [
        key,
        slots[key]({ class: props.classNames?.[key] }),
      ])
    ) as HeroUiSelectProps['classNames']
  }, [props.size])

  return (
    <HeroUiSelect
      {...props}
      classNames={classNames}
      size={props.size ?? 'md'}
      variant="faded"
      listboxProps={{
        variant: 'flat',
        ...props.listboxProps,
      }}
    />
  )
}

export const SelectSection = HeroUiSelectSection

export const SelectItem = HeroUiSelectItem
