import { CheckboxGroup, Checkbox, cn } from '@heroui/react'

import { VOD_KEYS } from '@/constants/vods'

import { webext } from '@/utils/webext'
import { mwpVods } from '@/mwp/vods'
import { useSettings } from '@/hooks/useSettings'

const { name } = webext.runtime.getManifest()

export const SelectVods: React.FC = () => {
  const [vods, setVods] = useSettings('settings:vods')

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-evenly gap-8',
        'size-full p-6',
        'overflow-y-auto'
      )}
    >
      <div className="flex flex-col items-center">
        <h2 className="my-4 text-2xl font-bold">動画配信サービスを選択</h2>

        <div
          className={cn(
            'flex flex-col items-center',
            'text-medium text-foreground-400 dark:text-foreground-600'
          )}
        >
          <p>{name}で使用する動画配信サービスを全て選択してください。</p>
          <p>設定は後からでも変更できます。</p>
        </div>
      </div>

      <CheckboxGroup
        classNames={{
          base: 'my-4',
          label: 'text-small text-foreground',
          wrapper: 'justify-center gap-3',
        }}
        size="lg"
        orientation="horizontal"
        value={vods}
        onChange={setVods as any}
      >
        {VOD_KEYS.map((key) => (
          <Checkbox
            key={key}
            classNames={{
              base: [
                'min-h-14 max-w-none',
                'm-0 p-3',
                'bg-default-100 hover:bg-default-200',
                'data-[selected=true]:bg-primary/15 dark:data-[selected=true]:bg-primary/20',
                'rounded-large',
                'border-2 border-divider hover:border-default-400',
                'data-[selected=true]:border-primary',
                'transition-colors motion-reduce:transition-none',
                'cursor-pointer',
              ],
              wrapper: [
                'rounded-full',
                'before:rounded-full before:border-2 before:!bg-default-50',
                'after:rounded-full',
              ],
              icon: 'h-3 w-4',
              label: 'flex w-full flex-row',
            }}
            value={key}
          >
            <div className="w-full min-w-2" />
            <span className="line-clamp-1 max-w-full shrink-0">
              {mwpVods[key].name}
            </span>
            <div className="w-full min-w-2" />
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  )
}
