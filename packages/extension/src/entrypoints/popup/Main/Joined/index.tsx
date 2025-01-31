import { RoomInfo } from './RoomInfo'
import { Controller } from './Controller'

export const Joined: React.FC = () => {
  return (
    <div className="flex size-full flex-row gap-2 overflow-hidden p-2">
      <RoomInfo />

      <Controller />
    </div>
  )
}
