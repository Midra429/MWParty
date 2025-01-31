import type { MwpStateKey } from '@/mwp/state'
import type { StateItems } from '@/types/storage'

import { useEffect, useState } from 'react'

import { mwpState } from '@/mwp/state'

export const useMwpState = <Key extends MwpStateKey>(
  key: Key
): StateItems[`state:${Key}`] | null => {
  const [state, setState] = useState<StateItems[`state:${Key}`] | null>(null)

  useEffect(() => {
    return mwpState.watch(key, setState)
  }, [])

  return state
}
