import type { ReceiveMessageMain } from 'backend/schemas/message'

import { PresenceMessage } from './PresenceMessage'
import { PlaybackMessage } from './PlaybackMessage'
import { ChatMessage } from './ChatMessage'

export type MessageProps = {
  data: ReceiveMessageMain
}

export const Message: React.FC<MessageProps> = ({ data }) => {
  switch (data.type) {
    case 'presence': {
      return <PresenceMessage message={data} />
    }

    case 'playback': {
      return <PlaybackMessage message={data} />
    }

    case 'chat': {
      return <ChatMessage message={data} />
    }
  }
}
