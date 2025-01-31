import type { StorageItems, SettingsKey } from '@/types/storage'
import type { SettingsInputBaseProps } from '.'

import { Switch } from "@heroui/react"

import { useSettings } from '@/hooks/useSettings'

import { ItemLabel } from '@/components/ItemLabel'

export type Key = {
  [key in SettingsKey]: StorageItems[key] extends boolean ? key : never
}[SettingsKey]

export type Props<K extends Key = Key> = SettingsInputBaseProps<K, 'toggle', {}>

export const Input: React.FC<Props> = (props) => {
  const [value, setValue] = useSettings(props.settingsKey)

  return (
    <Switch
      classNames={{
        base: [
          'flex flex-row-reverse justify-between gap-2',
          'w-full max-w-full p-3',
          'rounded-medium',
          'hover:bg-content2',
          'transition-colors',
          'overflow-hidden',
        ],
        wrapper: 'border-1 border-divider',
        label: 'm-0',
      }}
      size="md"
      isSelected={value}
      onValueChange={setValue}
    >
      <ItemLabel
        size="md"
        title={props.label}
        description={props.description}
      />
    </Switch>
  )
}
