import { useEffect } from 'react'
import { Spinner } from '@heroui/react'
import {
  ClerkLoading,
  ClerkLoaded,
  SignedOut,
  SignedIn,
} from '@clerk/chrome-extension'

import { webext } from '@/utils/webext'
import { useStorage } from '@/hooks/useStorage'

import { Layout } from '@/components/Layout'
import { ClerkProvider } from '@/components/ClerkProvider'

import { Login } from './Login'
import { Setup } from './Setup'
import { Settings } from './Settings'

const { name } = webext.runtime.getManifest()

const App: React.FC = () => {
  const [setupFinished] = useStorage('_setup_finished')

  useEffect(() => {
    document.title = `${name} ${setupFinished ? '設定' : '初期設定'}`
  }, [setupFinished])

  return (
    <Layout className="h-screen w-screen overflow-hidden">
      <ClerkProvider>
        <ClerkLoading>
          <div className="flex size-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignedOut>
            <Login />
          </SignedOut>

          <SignedIn>{setupFinished ? <Settings /> : <Setup />}</SignedIn>
        </ClerkLoaded>
      </ClerkProvider>
    </Layout>
  )
}

export default App
