import { useState, useCallback, useMemo } from 'react'
import { Link, cn } from "@heroui/react"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { GITHUB_URL } from '@/constants'

import { webext } from '@/utils/webext'
import { storage } from '@/utils/storage/extension'

import { Button } from '@/components/Button'

import { LoggedInAccount } from './LoggedInAccount'
import { SelectVods } from './SelectVods'
import { Finish } from './Finish'

const CONTENTS: React.FC[] = [
  // ログイン中のアカウント
  LoggedInAccount,
  // 動画配信サービスを選択
  SelectVods,
  // 完了
  Finish,
]

const CONTENT_LENGTH = CONTENTS.length

const { name, version } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

export const Setup: React.FC = () => {
  const [progress, setProgress] = useState(1)

  const onPressPrev = useCallback(() => {
    setProgress((v) => (1 < v ? --v : v))
  }, [])

  const onPressNext = useCallback(async () => {
    if (progress < CONTENT_LENGTH) {
      setProgress(progress + 1)
    } else {
      await storage.set('_setup_finished', true)
    }
  }, [progress])

  const Content = useMemo(() => {
    return CONTENTS[progress - 1]
  }, [progress])

  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-6',
        'h-full w-screen max-w-screen-md',
        'mx-auto p-8'
      )}
    >
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-row items-center gap-2">
          <img
            className="select-none"
            width={32}
            height={32}
            src={iconUrl}
            draggable={false}
          />

          <h1 className="ml-1 shrink-0 text-2xl font-bold">{name} 初期設定</h1>
        </div>

        <Link
          className="mx-1 text-large text-foreground-400 dark:text-foreground-600"
          underline="hover"
          href={`${GITHUB_URL}/releases/tag/v${version}`}
          isExternal
        >
          v{version}
        </Link>
      </div>

      <div
        className={cn(
          'size-full max-h-[768px]',
          'rounded-large',
          'border-1 border-foreground-100',
          'bg-content1',
          'shadow-medium',
          'overflow-hidden'
        )}
      >
        <Content />
      </div>

      <div className="flex w-full shrink-0 flex-row items-center justify-between">
        <Button
          className="data-[disabled=true]:invisible"
          variant="flat"
          size="lg"
          radius="full"
          startContent={<ChevronLeftIcon />}
          isDisabled={progress === 1}
          onPress={onPressPrev}
        >
          戻る
        </Button>

        <span className="select-none text-large text-foreground-400 dark:text-foreground-600">
          {progress} / {CONTENT_LENGTH}
        </span>

        <Button
          variant={progress !== CONTENT_LENGTH ? 'flat' : 'solid'}
          size="lg"
          radius="full"
          color="primary"
          endContent={
            progress !== CONTENT_LENGTH ? <ChevronRightIcon /> : <CheckIcon />
          }
          onPress={onPressNext}
        >
          {progress !== CONTENT_LENGTH ? '次へ' : '完了'}
        </Button>
      </div>
    </div>
  )
}
