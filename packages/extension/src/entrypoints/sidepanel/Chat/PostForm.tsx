import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  cn,
} from "@heroui/react"
import EmojiPicker from '@emoji-mart/react'
import emojiData from '@emoji-mart/data/sets/15/twitter.json'
import { SendHorizonalIcon, SmileIcon } from 'lucide-react'
import { CHAT_MAX_LENGTH } from 'backend/constants/schema'

import { mwpRoomProxy } from '@/proxy/mwpRoom/extension'
import { useTheme } from '@/hooks/useTheme'

import { Button } from '@/components/Button'

export type PostFormProps = {
  onSend: () => void
}

export const PostForm: React.FC<PostFormProps> = ({ onSend }) => {
  const theme = useTheme()

  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const length = useMemo(() => {
    return [...text.trim()].length
  }, [text])

  const sendChat = useCallback(
    async (text: string) => {
      setIsLoading(true)

      await mwpRoomProxy.send({
        type: 'chat',
        body: text.trim(),
      })

      onSend()

      setText('')
      setIsLoading(false)

      setTimeout(() => {
        textAreaRef.current?.focus()
      }, 100)
    },
    [onSend]
  )

  const isDisabled = !length || CHAT_MAX_LENGTH < length

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        'w-full shrink-0 p-2',
        'border-t-1 border-foreground-200',
        'bg-content1'
      )}
    >
      <div className="flex flex-row items-end gap-2">
        <Popover
          classNames={{
            base: 'w-[90vw] max-w-[350px]',
            content: [
              'p-0.5',
              '[&>div]:w-full [&_em-emoji-picker]:w-full',
              '[&_em-emoji-picker]:max-h-[350px]',
            ],
          }}
          placement="top-start"
          offset={20}
        >
          <PopoverTrigger>
            <Button variant="flat" isIconOnly startContent={<SmileIcon />} />
          </PopoverTrigger>

          <PopoverContent>
            <EmojiPicker
              data={emojiData}
              exceptEmojis={['cockroach']}
              set="twitter"
              locale="ja"
              theme={theme ?? 'auto'}
              dynamicWidth
              skinTonePosition="none"
              previewPosition="none"
              emojiSize={30}
              emojiButtonSize={40}
              emojiButtonRadius="0.375rem"
              maxFrequentRows={2}
              onEmojiSelect={(emoji: { native: string }) => {
                setText((text) => text + emoji.native)
              }}
            />
          </PopoverContent>
        </Popover>

        <Textarea
          classNames={{
            inputWrapper: 'border-1 border-divider !pr-7 shadow-none',
            clearButton: 'right-0 top-0 m-0 py-[11px] pl-0 pr-2',
          }}
          minRows={1}
          isInvalid={CHAT_MAX_LENGTH < length}
          isClearable={!!text}
          isDisabled={isLoading}
          placeholder="チャットを送信"
          value={text}
          onValueChange={setText}
          onKeyDown={({ key, ctrlKey, metaKey }) => {
            if (!isDisabled && (ctrlKey || metaKey) && key === 'Enter') {
              sendChat(text)
            }
          }}
          ref={textAreaRef}
        />

        <Button
          color="primary"
          isIconOnly
          isDisabled={isDisabled}
          isLoading={isLoading}
          startContent={<SendHorizonalIcon />}
          onPress={() => sendChat(text)}
        />
      </div>
    </div>
  )
}
