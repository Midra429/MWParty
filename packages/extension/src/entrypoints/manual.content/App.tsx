import { cn } from '@heroui/react'

import { Layout } from '@/components/Layout'

import { Main } from './Main'

const App: React.FC = () => {
  return (
    <Layout
      className={cn(
        'flex flex-col items-center justify-center',
        'h-screen w-screen',
        'overflow-hidden'
      )}
    >
      <Main />
    </Layout>
  )
}

export default App
