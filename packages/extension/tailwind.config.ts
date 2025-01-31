import type { Config } from 'tailwindcss'
import type { CustomThemeConfig } from 'tailwindcss/types/config'

import { heroui } from '@heroui/react'

import { themeColorsLight, themeColorsDark } from './theme-colors'

const fontSize: CustomThemeConfig['fontSize'] = {
  mini: ['0.6875rem', '0.875rem'],
}

const size: CustomThemeConfig['width' | 'height'] = {
  mini: fontSize.mini[0],
  tiny: '0.75rem',
  small: '0.875rem',
  medium: '1rem',
  large: '1.125rem',
}

export default {
  content: [
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize,
      width: size,
      height: size,
      size: size,
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: themeColorsLight,
        },
        dark: {
          colors: themeColorsDark,
        },
      },
    }),
  ],
} satisfies Config
