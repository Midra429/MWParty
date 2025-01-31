import { Tab, Tabs, Spinner } from '@heroui/react'
import { ClerkLoading, ClerkLoaded, SignedIn } from '@clerk/chrome-extension'
import { MessageSquareMoreIcon, Users2Icon } from 'lucide-react'

import { useMwpState } from '@/hooks/useMwpState'

import { Layout } from '@/components/Layout'
import { ClerkProvider } from '@/components/ClerkProvider'

import { Chat } from './Chat'
import { Members } from './Members'

const App: React.FC = () => {
  const joinedRoom = useMwpState('room')

  return (
    <Layout className="flex h-screen w-screen flex-col overflow-hidden">
      <ClerkProvider>
        <ClerkLoading>
          <div className="flex size-full items-center justify-center">
            <Spinner />
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <Tabs
              classNames={{
                base: 'flex border-b-1 border-divider bg-content1',
                tabList: 'gap-0 p-0',
                tab: [
                  'h-fit py-3',
                  '!opacity-100',
                  'data-[hover=true]:bg-content2/50',
                  'transition-colors',
                ],
                tabContent: 'flex flex-row items-center gap-2',
                panel: 'size-full overflow-hidden p-0',
              }}
              size="md"
              variant="underlined"
              color="primary"
              fullWidth
            >
              <Tab
                key="chat"
                title={
                  <>
                    <MessageSquareMoreIcon className="size-5" />
                    <span>チャット</span>
                  </>
                }
              >
                {joinedRoom && <Chat />}
              </Tab>

              <Tab
                key="members"
                title={
                  <>
                    <Users2Icon className="size-5" />
                    <span>メンバー</span>
                  </>
                }
              >
                {joinedRoom && <Members />}
              </Tab>
            </Tabs>
          </SignedIn>
        </ClerkLoaded>
      </ClerkProvider>
    </Layout>
  )
}

export default App
