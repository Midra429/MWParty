import { cn } from "@heroui/react"
import { SettingsIcon } from 'lucide-react'

import { webext } from '@/utils/webext'

import { Button } from '@/components/Button'

const { name } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

export const Header: React.FC = () => {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between',
        'w-full shrink-0 p-2',
        'border-b-1 border-foreground-200',
        'bg-content1'
      )}
    >
      <div className="flex w-full flex-row justify-start overflow-hidden">
        <div className="flex w-full flex-row items-center gap-1.5">
          <img
            className="select-none"
            width={32}
            height={32}
            src={iconUrl}
            draggable={false}
          />

          <h1 className="ml-1 shrink-0 text-large font-bold">{name}</h1>
        </div>
      </div>

      <Button
        className="shrink-0"
        size="sm"
        variant="flat"
        radius="full"
        startContent={<SettingsIcon />}
        onPress={() => void webext.runtime.openOptionsPage()}
      >
        設定
      </Button>
    </div>
  )
}
