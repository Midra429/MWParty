import type { UserManifest } from 'wxt'

import { defineConfig } from 'wxt'

import { GITHUB_URL } from './src/constants'
import { uid } from './src/utils/uid'
import { name, displayName, description } from './package.json'

const EXT_BUILD_ID = uid()

export default defineConfig({
  manifestVersion: 3,
  manifest: ({ browser }) => {
    const key = import.meta.env.WXT_CRX_PUBLIC_KEY || undefined

    const permissions: UserManifest['permissions'] = [
      'storage',
      'unlimitedStorage',
      'tabs',
      'cookies',
      'clipboardWrite',
    ]

    let browser_specific_settings: UserManifest['browser_specific_settings']

    switch (browser) {
      case 'chrome': {
        permissions.push('sidePanel')

        break
      }

      case 'firefox': {
        browser_specific_settings = {
          gecko: {
            id: `${name}@midra.me`,
            strict_min_version: '113.0',
          },
        }

        break
      }
    }

    return {
      key,
      name: displayName,
      description,
      homepage_url: GITHUB_URL,
      web_accessible_resources: [
        {
          resources: ['icons/128.png'],
          matches: [`${import.meta.env.WXT_PARTYKIT_HOST}/*`],
        },
      ],
      permissions,
      host_permissions: ['<all_urls>'],
      minimum_chrome_version: '116',
      browser_specific_settings,
    }
  },

  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      const key = import.meta.env.WXT_CRX_PUBLIC_KEY

      if (key) {
        // @ts-expect-error
        manifest.key = key
      }

      switch (wxt.config.browser) {
        case 'firefox': {
          if (manifest.sidebar_action) {
            manifest.sidebar_action = {
              ...manifest.sidebar_action,
              default_icon: manifest.icons,
              open_at_install: false,
            }
          }

          manifest.content_security_policy = {
            extension_pages: [
              "script-src 'self';",
              "worker-src 'self' blob:;",
              "object-src 'self';",
            ].join(' '),
          }

          break
        }
      }
    },
  },

  srcDir: 'src',
  outDir: 'dist',
  alias: {
    backend: '../backend/src',
  },
  autoIcons: {
    baseIconPath: '../assets/icon.png',
    sizes: [512],
    grayscaleOnDevelopment: false,
  },
  imports: false,
  vite: () => ({
    define: {
      EXT_BUILD_ID: JSON.stringify(EXT_BUILD_ID),
    },
    build: {
      chunkSizeWarningLimit: Infinity,
    },
    ssr: {
      noExternal: ['@webext-core/messaging'],
    },
  }),
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
})
