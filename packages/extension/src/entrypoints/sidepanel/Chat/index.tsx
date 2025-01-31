import type { MessageListHandle } from './MessageList'

import { useRef } from 'react'

import { MessageList } from './MessageList'
import { PostForm } from './PostForm'

export const Chat: React.FC = () => {
  const messageListRef = useRef<MessageListHandle>(null)

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <MessageList ref={messageListRef} />

      <PostForm
        onSend={() => messageListRef.current?.setAutoScrollEnabled(true)}
      />
    </div>
  )
}
