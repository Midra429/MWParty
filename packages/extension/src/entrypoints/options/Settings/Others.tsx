import { Fragment } from 'react/jsx-runtime'
import { Link, Divider, cn } from '@heroui/react'
import { useClerk } from '@clerk/chrome-extension'
import { PowerIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react'
import { SiGithub, SiX, SiAmazon } from '@icons-pack/react-simple-icons'

import { GITHUB_URL, LINKS } from '@/constants'

import { webext } from '@/utils/webext'
import { storage } from '@/utils/storage/extension'
import { settings } from '@/utils/settings/extension'
import { mwpRoomProxy } from '@/proxy/mwpRoom/extension'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { ItemLabel } from '@/components/ItemLabel'
import { Popconfirm } from '@/components/Popconfirm'
import { LogOutButton } from '@/components/mwp/LogOutButton'

import { author } from '@@/package.json'

const { name, version } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/512.png')

const repositoryName = new URL(GITHUB_URL).pathname.slice(1)
const releaseNoteUrl = `${GITHUB_URL}/releases/tag/v${version}`

const linkIcons: {
  [key: string]: React.FC<React.ComponentProps<'svg'>> | undefined
} = {
  'X / Twitter': SiX,
  'Amazon': SiAmazon,
}

export const Others: React.FC = () => {
  const clerk = useClerk()

  const joinedRoom = useMwpState('room')

  return (
    <div
      className={cn('flex flex-col gap-6', 'size-full p-6', 'overflow-y-auto')}
    >
      <div className="my-6 flex h-full flex-col items-center justify-center gap-10">
        <img
          className="select-none"
          width={120}
          height={120}
          src={iconUrl}
          draggable={false}
        />

        <div className="flex flex-col gap-2">
          <span className="text-3xl font-bold">{name}</span>

          <Link
            className="text-large text-foreground-400 dark:text-foreground-600"
            underline="hover"
            href={releaseNoteUrl}
            isExternal
          >
            バージョン {version}
          </Link>
        </div>

        <p className="text-medium text-foreground-400 dark:text-foreground-600">
          &copy; 2025 {author}
        </p>
      </div>

      <Divider />

      <div className="flex shrink-0 flex-row items-start">
        <ItemLabel
          className="w-full items-center"
          size="md"
          title={
            <div className="flex flex-row items-center gap-2 truncate">
              <SiGithub className="size-5" />

              <span>GitHub</span>
            </div>
          }
          description={
            <Link
              className="truncate text-[length:inherit]"
              underline="hover"
              href={GITHUB_URL}
              isExternal
            >
              {repositoryName}
            </Link>
          }
        />

        {LINKS.map(({ title, label, url }, idx) => {
          const Icon = linkIcons[title]

          return (
            <Fragment key={idx}>
              <Divider orientation="vertical" />

              <ItemLabel
                className="w-full items-center"
                size="md"
                title={
                  <div className="flex flex-row items-center gap-2 truncate">
                    {Icon && <Icon className="size-5" />}

                    <span>{title}</span>
                  </div>
                }
                description={
                  url ? (
                    <Link
                      className="truncate text-[length:inherit]"
                      underline="hover"
                      href={url}
                      isExternal
                    >
                      {label}
                    </Link>
                  ) : (
                    label
                  )
                }
              />
            </Fragment>
          )
        })}
      </div>

      <Divider />

      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <Popconfirm
            title="拡張機能を再起動しますか？"
            description="参加中の部屋から退室し、再起動します。"
            onOk={async () => {
              await mwpRoomProxy.leave()

              webext.runtime.reload()
            }}
          >
            <Button variant="flat" startContent={<PowerIcon />}>
              再起動
            </Button>
          </Popconfirm>

          <LogOutButton />
        </div>

        <div className="flex flex-row gap-3">
          <Popconfirm
            title="設定をリセットしますか？"
            description="全ての設定が初期値に戻されます。"
            okColor="danger"
            onOk={() => settings.remove()}
          >
            <Button
              variant="flat"
              color="danger"
              startContent={<RotateCcwIcon />}
            >
              リセット
            </Button>
          </Popconfirm>

          <Popconfirm
            title="拡張機能を初期化しますか？"
            description="全てのデータが消去されます。"
            okColor="danger"
            onOk={async () => {
              await mwpRoomProxy.leave()

              await clerk.signOut()

              await storage.remove()
            }}
          >
            <Button
              variant="flat"
              color="danger"
              isDisabled={!!joinedRoom}
              startContent={<Trash2Icon />}
            >
              初期化
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  )
}
