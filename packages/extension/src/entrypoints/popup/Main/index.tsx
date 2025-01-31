import { memo } from 'react'

import { useMwpState } from '@/hooks/useMwpState'

import { Unjoined } from './Unjoined'
import { Joined } from './Joined'

/**
 * メイン
 */
export const Main: React.FC = memo(() => {
  const joinedRoom = useMwpState('room')

  return joinedRoom ? <Joined /> : <Unjoined />
})
