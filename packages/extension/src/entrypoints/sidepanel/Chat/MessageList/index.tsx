import type { VListHandle } from 'virtua'

import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react'
import { cn } from '@heroui/react'
import { VList } from 'virtua'
import { ArrowDownIcon } from 'lucide-react'

import { useMwpState } from '@/hooks/useMwpState'

import { Button } from '@/components/Button'

import { Message } from './Message'

export type MessageListHandle = {
  autoScrollEnabled: boolean
  setAutoScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export type MessageListProps = {
  ref: React.Ref<MessageListHandle>
}

export const MessageList: React.FC<MessageListProps> = ({ ref }) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const presenceHistory = useMwpState('history:presence')
  const playbackHistory = useMwpState('history:playback')
  const chatHistory = useMwpState('history:chat')

  const history = useMemo(() => {
    return [
      ...(presenceHistory ?? []),
      ...(playbackHistory ?? []),
      ...(chatHistory ?? []),
    ].sort((a, b) => a.timestamp - b.timestamp)
  }, [presenceHistory?.length, playbackHistory?.length, chatHistory?.length])

  const virtua = useRef<VListHandle>(null)

  const scrollToLast = useCallback(() => {
    const scrollToLastIndex = () => {
      virtua.current?.scrollToIndex(history.length - 1)
    }

    scrollToLastIndex()

    setTimeout(scrollToLastIndex, 100)
  }, [history.length])

  useEffect(() => {
    if (!autoScrollEnabled) return

    setTimeout(scrollToLast, 0)
  }, [history.length])

  useImperativeHandle(ref, () => {
    return { autoScrollEnabled, setAutoScrollEnabled }
  }, [autoScrollEnabled])

  return (
    <div className="relative size-full">
      <VList
        className="pt-5"
        reverse
        itemSize={78}
        onScroll={(offset) => {
          const target = virtua.current

          if (!target) return

          const remainingScrollSize =
            target.scrollSize - (target.viewportSize + offset)

          setAutoScrollEnabled(remainingScrollSize < 10)
        }}
        ref={virtua}
      >
        {history.map((msg) => (
          <div key={msg.id} className="px-3 pb-5">
            <Message data={msg} />
          </div>
        ))}
      </VList>

      <Button
        className={cn(
          'absolute bottom-4 left-1/2',
          'max-w-[80%] -translate-x-1/2',
          'data-[disabled=true]:opacity-0',
          'data-[disabled=true]:pointer-events-none'
        )}
        size="sm"
        variant="shadow"
        radius="full"
        color="primary"
        isDisabled={autoScrollEnabled}
        startContent={<ArrowDownIcon />}
        onPress={scrollToLast}
      >
        最新のメッセージ
      </Button>
    </div>
  )
}
