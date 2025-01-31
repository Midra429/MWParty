import { Fragment } from 'react/jsx-runtime'
import { Tabs, Tab, Link, Divider, cn } from "@heroui/react"
import { User2Icon, CircleEllipsisIcon } from 'lucide-react'

import { GITHUB_URL } from '@/constants'
import { SETTINGS_INIT_DATA } from '@/constants/settings/init-data'

import { webext } from '@/utils/webext'

import { SettingsInput } from '@/components/SettingsInput'

import { Account } from './Account'
import { Others } from './Others'

const { name, version } = webext.runtime.getManifest()
const iconUrl = webext.runtime.getURL('/icons/128.png')

const tabItems: {
  key: string
  icon: React.FC<React.ComponentProps<'svg'>>
  title: string
  children: React.ReactNode
}[] = [
  ...SETTINGS_INIT_DATA.map((data) => ({
    key: data.id,
    icon: data.icon,
    title: data.title,
    children: (
      <div className="flex flex-col gap-3 p-3">
        {data.items.map((item, idx) => {
          const Input = SettingsInput[item.inputType]

          return (
            <Fragment key={idx}>
              {idx !== 0 && <Divider />}

              <Input {...(item as any)} />
            </Fragment>
          )
        })}
      </div>
    ),
  })),

  {
    key: 'account',
    icon: User2Icon,
    title: 'アカウント',
    children: <Account />,
  },

  {
    key: 'others',
    icon: CircleEllipsisIcon,
    title: 'その他',
    children: <Others />,
  },
]

export const Settings: React.FC = () => {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-6',
        'h-full w-screen max-w-screen-lg',
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

          <h1 className="ml-1 shrink-0 text-2xl font-bold">{name} 設定</h1>
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

      <Tabs
        classNames={{
          wrapper: 'size-full gap-4',
          tabList: 'overflow-visible p-0',
          tab: 'h-10 min-w-40 justify-start px-4',
          tabContent: 'flex flex-row items-center gap-2',
          panel: [
            'size-full max-h-[784px] p-0',
            'rounded-large',
            'border-1 border-foreground-100',
            'bg-content1',
            'shadow-medium',
            'overflow-auto',
          ],
        }}
        variant="light"
        size="lg"
        color="primary"
        isVertical
        items={tabItems}
      >
        {({ key, icon: Icon, title, children }) => (
          <Tab
            key={key}
            title={
              <>
                <Icon className="size-5" />
                <span>{title}</span>
              </>
            }
          >
            <div className="size-full min-h-fit min-w-[590px] overflow-hidden">
              {children}
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
