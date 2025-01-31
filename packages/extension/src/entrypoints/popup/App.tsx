import { Spinner, cn } from '@heroui/react'
import {
  ClerkLoading,
  ClerkLoaded,
  SignedOut,
  SignedIn,
} from '@clerk/chrome-extension'
import { SettingsIcon } from 'lucide-react'

import { webext } from '@/utils/webext'
import { useStorage } from '@/hooks/useStorage'

import { Layout } from '@/components/Layout'
import { ClerkProvider } from '@/components/ClerkProvider'
import { Button } from '@/components/Button'

import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'

const App: React.FC = () => {
  const [setupFinished] = useStorage('_setup_finished')

  return (
    <Layout className="text-tiny">
      <ClerkProvider>
        <div
          className="overflow-hidden"
          style={{
            width: 400,
            height: 300,
          }}
        >
          <ClerkLoading>
            <div className="flex size-full items-center justify-center">
              <Spinner />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <div className="flex size-full flex-col">
              <Header />

              <SignedOut>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-4',
                    'size-full'
                  )}
                >
                  <p className="text-medium">ログインしてください</p>

                  <Button
                    size="sm"
                    color="primary"
                    startContent={<SettingsIcon />}
                    onPress={() => void webext.runtime.openOptionsPage()}
                  >
                    設定を開く
                  </Button>
                </div>
              </SignedOut>

              <SignedIn>
                {setupFinished ? (
                  <>
                    <Main />

                    <Footer />
                  </>
                ) : (
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center gap-4',
                      'size-full'
                    )}
                  >
                    <p className="text-medium">初期設定を完了してください</p>

                    <Button
                      size="sm"
                      color="primary"
                      startContent={<SettingsIcon />}
                      onPress={() => void webext.runtime.openOptionsPage()}
                    >
                      設定を開く
                    </Button>
                  </div>
                )}
              </SignedIn>
            </div>
          </ClerkLoaded>
        </div>
      </ClerkProvider>
    </Layout>
  )
}

export default App
