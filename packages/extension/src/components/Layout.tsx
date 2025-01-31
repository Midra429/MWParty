import type { DefaultToastOptions } from 'react-hot-toast'

import { useEffect } from 'react'
import { HeroUIProvider, twMergeConfig, cn } from '@heroui/react'
import { Toaster } from 'react-hot-toast'

import { useTheme } from '@/hooks/useTheme'

import '@/assets/style.css'

twMergeConfig.classGroups['font-size'].push({ text: ['mini'] })

const toastOptions: DefaultToastOptions = {
  success: {
    iconTheme: {
      primary:
        'hsl(var(--heroui-success) / var(--heroui-success-opacity, var(--tw-bg-opacity)))',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary:
        'hsl(var(--heroui-danger) / var(--heroui-danger-opacity, var(--tw-bg-opacity)))',
      secondary: '#fff',
    },
  },
}

export type LayoutProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const theme = useTheme()

  useEffect(() => {
    document.body.className = cn(
      theme || 'hidden',
      'bg-background text-foreground'
    )
  }, [theme])

  return (
    <HeroUIProvider locale="ja-JP">
      <main
        className={cn('overflow-y-auto overflow-x-hidden', props.className)}
        style={props.style}
      >
        {props.children}
      </main>

      <Toaster
        containerClassName={cn(
          '[&>div>div]:border-1',
          '[&>div>div]:border-divider',
          '[&>div>div]:rounded-medium',
          '[&>div>div]:bg-content1',
          '[&>div>div]:text-small',
          '[&>div>div]:text-foreground',
          '[&>div>div]:shadow-small'
        )}
        toastOptions={toastOptions}
      />
    </HeroUIProvider>
  )
}
