import type { ClerkProviderProps } from '@clerk/chrome-extension'

import { ClerkProvider as Provider } from '@clerk/chrome-extension'
import { jaJP } from '@clerk/localizations'
import { dark } from '@clerk/themes'

import { deepmerge } from '@/utils/merge'
import { webext } from '@/utils/webext'
import { useTheme } from '@/hooks/useTheme'

const partykitHost = `https://${import.meta.env.WXT_PARTYKIT_HOST}`
const publishableKey = import.meta.env.WXT_CLERK_PUBLISHABLE_KEY

const iconUrl = webext.runtime.getURL('/icons/128.png')

const localization = deepmerge<
  ClerkProviderProps['localization'],
  ClerkProviderProps['localization']
>(jaJP, {
  signUp: {
    start: {
      title: 'アカウント作成',
    },
  },

  signIn: {
    start: {
      title: 'ログイン',
    },
  },

  userButton: {
    action__signOut: 'ログアウト',
  },

  userProfile: {
    start: {
      profileSection: {
        primaryButton: 'プロフィールの変更',
      },
      usernameSection: {
        title: 'ユーザーID',
        primaryButton__setUsername: 'ユーザーIDの設定',
        primaryButton__updateUsername: 'ユーザーIDの変更',
      },
    },
    usernamePage: {
      title__set: 'ユーザーIDの更新',
      title__update: 'ユーザーIDの更新',
      successMessage: 'ユーザーIDが更新されました。',
    },
  },

  formFieldLabel__firstName: '名前',
  formFieldLabel__username: 'ユーザーID',
  formFieldLabel__emailAddress_username: 'メールアドレスまたはユーザーID',

  formFieldInputPlaceholder__firstName: '例: みどらん',
  formFieldInputPlaceholder__username: '例: midra429',
  formFieldInputPlaceholder__password: '',
  formFieldInputPlaceholder__emailAddress: '例: email@example.com',
  formFieldInputPlaceholder__emailAddress_username:
    '例: email@example.com / midra429',
})

const appearance: ClerkProviderProps['appearance'] = {
  layout: {
    logoImageUrl: iconUrl,
  },
  elements: {
    logoBox: {
      pointerEvents: 'none',
    },
    headerSubtitle: {
      display: 'none',
    },
    alertTextContainer: {
      wordBreak: 'break-all',
    },
    socialButtonsRoot: webext.isFirefox
      ? {
          'display': 'none',

          '& + .cl-dividerRow': {
            display: 'none',
          },
        }
      : undefined,
    formField__lastName: {
      display: 'none',
    },
    formFieldInput__username: {
      textTransform: 'lowercase',
    },
    formFieldInput__identifier: {
      textTransform: 'lowercase',
    },
    formButtonPrimary: {
      '&::after': {
        display: 'none',
      },
    },
    profileSectionItem__username: {
      '& > p::before': {
        display: 'inline',
        content: '"@"',
      },
    },
    footerAction: {
      'display': 'none',

      '& + *': {
        borderTop: 'none !important',
      },
    },
  },
}

export const ClerkProvider: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const theme = useTheme()

  const isDark = theme === 'dark'

  return (
    <Provider
      publishableKey={publishableKey}
      allowedRedirectOrigins={[partykitHost]}
      signUpForceRedirectUrl={`${partykitHost}/redirect/afterSignUp`}
      signInForceRedirectUrl={`${partykitHost}/redirect/afterSignIn`}
      afterSignOutUrl={`${partykitHost}/redirect/afterSignOut`}
      localization={localization}
      appearance={{
        ...appearance,
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: isDark ? '#50bdff' : '#0478ff',
          colorTextOnPrimaryBackground: isDark ? '#000' : '#fff',
        },
      }}
      {...props}
    />
  )
}
