import { cn } from "@heroui/react"

import { webext } from '@/utils/webext'

const { name } = webext.runtime.getManifest()

export const Finish: React.FC = () => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        'size-full p-6',
        'overflow-y-auto'
      )}
    >
      <h2 className="text-3xl font-bold">{name}へようこそ！</h2>

      <div
        className={cn(
          'flex flex-col items-center',
          'text-medium text-foreground-400 dark:text-foreground-600'
        )}
      >
        <p>右下の「完了」を押して初期設定を終了してください。</p>
      </div>
    </div>
  )
}
