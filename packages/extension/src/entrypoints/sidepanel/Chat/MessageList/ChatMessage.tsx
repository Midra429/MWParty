import type { LinkProps } from '@heroui/react'
import type { ChatReceiveMessage } from 'backend/schemas/message'

import { useState, useMemo } from 'react'
import {
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  Link,
  cn,
} from '@heroui/react'
import { useUser } from '@clerk/chrome-extension'
import Twemoji from 'react-twemoji'
import emojiRegex from 'emoji-regex'
import { HomeIcon, LinkIcon, ExternalLinkIcon } from 'lucide-react'

import { countString } from '@/utils/string'
import { formatDate } from '@/utils/format'
import { webext } from '@/utils/webext'
import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'
import { UrlPreview } from '@/components/UrlPreview'

const MAX_EMOJI_ONLY_COUNT = 5
const MIN_EMOJI_SIZE = 1.2
const MAX_EMOJI_SIZE = MIN_EMOJI_SIZE * 4

const emojiRegExp = emojiRegex()
const urlRegExp =
  /(https?:\/\/(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(?:\/[^\s\n]*)?)/g

const LinkWithPopover: React.FC<LinkProps> = ({ href, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      classNames={{
        content: 'overflow-hidden p-0',
      }}
      radius="full"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>
        <Link {...props}>{props.children}</Link>
      </PopoverTrigger>

      <PopoverContent>
        <ButtonGroup size="sm" variant="light">
          <Button
            size="sm"
            startContent={<LinkIcon />}
            onPress={async () => {
              await webext.tabs.update({ url: href })

              setIsOpen(false)
            }}
          >
            現在のタブ
          </Button>

          <Button
            size="sm"
            startContent={<ExternalLinkIcon />}
            onPress={async () => {
              await webext.tabs.create({ url: href })

              setIsOpen(false)
            }}
          >
            新しいタブ
          </Button>
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  )
}

const LinkifyText: React.FC<{
  text: string
  isHost?: boolean
}> = ({ text, isHost }) => {
  return text.split(urlRegExp).map((part, idx) => {
    if (urlRegExp.test(part) && URL.canParse(part)) {
      const url = new URL(part)

      const content = (
        <>
          {`${url.protocol}//`}
          <span className="font-bold">{url.hostname}</span>
          {decodeURIComponent(url.pathname)}
          {decodeURIComponent(url.search)}
          {decodeURIComponent(url.hash)}
        </>
      )

      return isHost ? (
        <LinkWithPopover
          key={idx}
          className="inline cursor-pointer text-small"
          underline="hover"
          href={part}
        >
          {content}
        </LinkWithPopover>
      ) : (
        <Link
          key={idx}
          className="inline text-small"
          underline="hover"
          href={part}
          isExternal
        >
          {content}
        </Link>
      )
    }

    return <span key={idx}>{part}</span>
  })
}

export type ChatMessageProps = {
  message: ChatReceiveMessage
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useUser()

  const joinedRoom = useMwpState('room')
  const presence = useMwpState('presence')

  const emojiSize = useMemo(() => {
    const count = countString(message.body)
    const emojiCount = [...message.body.matchAll(emojiRegExp)].length

    if (count <= MAX_EMOJI_ONLY_COUNT && count === emojiCount) {
      return (
        MIN_EMOJI_SIZE +
        ((MAX_EMOJI_SIZE - MIN_EMOJI_SIZE) / MAX_EMOJI_ONLY_COUNT) *
          Math.max(MAX_EMOJI_ONLY_COUNT - count + 1, 0)
      )
    }
  }, [message.body])

  const lastUrl = useMemo(() => {
    return message.body.match(urlRegExp)?.at(-1)
  }, [message.body])

  const isOnline = useMemo(() => {
    return !!presence?.users.find((v) => v.id === message.user.id)
  }, [presence?.users, message.user.id])

  const isOwn = message.user._isOwn
  const isOwner = message.user.id === joinedRoom?.user_id
  const isHost = user?.id === joinedRoom?.user_id

  return (
    <div
      className={cn('flex gap-1.5', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className="relative size-fit">
        {/* プロフィール画像 */}
        <Avatar
          classNames={{
            base: 'border-1 border-foreground-200',
            img: 'select-none',
          }}
          imgProps={{
            draggable: false,
          }}
          size="md"
          isDisabled={!isOnline}
          src={message.user.imageUrl}
        />

        {/* オンラインステータス */}
        <div
          className={cn(
            'absolute bottom-[-1.5px] right-[-1.5px]',
            'size-3',
            'border-1.5 border-background',
            'rounded-full',
            isOnline ? 'bg-success' : 'bg-gray-400'
          )}
        />
      </div>

      <div
        className={cn(
          'flex flex-col gap-1',
          isOwn ? 'items-end' : 'items-start',
          'w-full',
          'overflow-hidden'
        )}
      >
        {/* 名前 / ユーザーID */}
        <header
          className={cn(
            'flex flex-row items-center gap-1',
            'max-w-full px-0.5 text-tiny'
          )}
        >
          {/* ホスト */}
          {isOwner && (
            <div
              className={cn(
                'flex items-center justify-center',
                'size-4 shrink-0',
                'rounded-full',
                'bg-primary text-primary-foreground'
              )}
            >
              <HomeIcon className="size-2.5" strokeWidth={2.5} />
            </div>
          )}

          <span className="truncate font-bold">
            {message.user.name || message.user.username}
          </span>

          <span className="truncate text-foreground-400 dark:text-foreground-600">
            @{message.user.username}
          </span>
        </header>

        <div
          className={cn(
            'flex items-end gap-1.5',
            isOwn ? 'flex-row-reverse' : 'flex-row',
            'max-w-full'
          )}
        >
          {/* 本文 */}
          <div
            className={cn(
              'size-fit max-w-full px-2.5 py-2',
              'border-1 border-divider',
              'rounded-large',
              isOwn ? 'rounded-tr-none' : 'rounded-tl-none',
              'bg-content1',
              'text-small',
              'overflow-hidden'
            )}
          >
            <Twemoji noWrapper>
              <span
                className={cn(
                  'inline-block',
                  'w-full',
                  'whitespace-pre-wrap break-all',

                  // Twemoji
                  '[&>img]:inline',
                  '[&>img]:size-[var(--emoji-size)]',
                  '[&>img]:mx-0.5',
                  '[&>img]:mt-[-0.15em]',
                  '[&>img:is([alt="🪳"])]:blur-[var(--emoji-blur)]',

                  // 絵文字のみ
                  emojiSize && [
                    '[&>img]:mx-0',
                    '[&>img]:my-0.5',
                    '[&>img:not(:first-child)]:ml-[var(--emoji-margin)]',
                  ]
                )}
                style={
                  {
                    '--emoji-size': `${emojiSize || MIN_EMOJI_SIZE}em`,
                    '--emoji-margin': emojiSize
                      ? `${emojiSize / 6}em`
                      : undefined,
                    '--emoji-blur': `${(emojiSize || MIN_EMOJI_SIZE) / 8}em`,
                  } as React.CSSProperties
                }
              >
                <LinkifyText text={message.body} isHost={isHost} />
              </span>
            </Twemoji>

            {/* リンクプレビュー */}
            {lastUrl && (
              <UrlPreview className="mb-0.5 ml-auto mt-2" url={lastUrl} />
            )}
          </div>

          {/* 時間 */}
          <span
            className={cn(
              'shrink-0',
              'text-tiny',
              'text-foreground-400 dark:text-foreground-600',
              'opacity-75'
            )}
          >
            {formatDate(message.timestamp, 'h時mm分')}
          </span>
        </div>
      </div>
    </div>
  )
}
