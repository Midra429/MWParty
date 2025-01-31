import type { StorageItems, SettingsKey } from '@/types/storage'
import type { SettingsInputBaseProps } from '.'

import { CheckboxGroup, Checkbox } from "@heroui/react"

import { useSettings } from '@/hooks/useSettings'
import { ItemLabel } from '../ItemLabel'

export type Key = {
  [key in SettingsKey]: StorageItems[key] extends (string | number)[]
    ? key
    : never
}[SettingsKey]

export type Props<K extends Key = Key> = SettingsInputBaseProps<
  K,
  'checkbox',
  {
    options: {
      label: string
      value: StorageItems[K][number]
    }[]
  }
>

export const Input: React.FC<Props> = (props) => {
  const [value, setValue] = useSettings(props.settingsKey)

  return (
    <CheckboxGroup
      classNames={{
        base: 'gap-3 p-3',
        label: 'text-foreground',
        wrapper: 'gap-2',
      }}
      size="md"
      orientation="horizontal"
      label={
        <ItemLabel
          size="md"
          title={props.label}
          description={props.description}
        />
      }
      value={value}
      onChange={setValue as any}
    >
      {props.options.map(({ label, value }, idx) => (
        <Checkbox
          key={idx}
          classNames={{
            base: [
              'max-w-none',
              'm-0 p-2',
              'bg-default-100 hover:bg-default-200',
              'data-[selected=true]:bg-primary/15 dark:data-[selected=true]:bg-primary/20',
              'rounded-medium',
              'border-1 border-divider hover:border-default-400',
              'data-[selected=true]:border-primary',
              'transition-colors motion-reduce:transition-none',
              'cursor-pointer',
            ],
            wrapper: [
              'm-0 rounded-full',
              'before:rounded-full before:border-1 before:!bg-default-50',
              'after:rounded-full',
            ],
            label: 'px-3',
          }}
          value={value}
        >
          {label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  )
}
