import type { SemanticBaseColors, ThemeColors } from '@heroui/react'

import { semanticColors } from '@heroui/theme/colors'

import { readableColor } from './src/utils/color'

/**
 * これを短くした ↓
 * @see https://github.com/frontio-ai/heroui/blob/canary/packages/core/theme/src/utils/object.ts#L3
 */
const swapColorValues = <T extends Object>(colors: T): T => {
  const keys = Object.keys(colors)
  const values = Object.values(colors)

  return Object.fromEntries(
    values.reverse().map((val, idx) => [keys[idx], val])
  ) as T
}

const primary = {
  50: '#edf9ff',
  100: '#d7efff',
  200: '#b9e4ff',
  300: '#88d6ff',
  400: '#50bdff',
  500: '#289dff',
  600: '#0478ff', // P
  700: '#0a67eb',
  800: '#0f52be',
  900: '#134895',
  // 950: '#112d5a',
}

const secondary = {
  '50': '#fff1f4',
  '100': '#ffe4ea',
  '200': '#fecdd9',
  '300': '#fea3ba',
  '400': '#fc7096',
  '500': '#f64379', // P
  '600': '#e31b61',
  '700': '#c01052',
  '800': '#a0114b',
  '900': '#891247',
  // '950': '#4d0423',
}

const gray = {
  light: {
    50: '#f7f8f8',
    100: '#eeeef0',
    200: '#d8dadf',
    300: '#b6b9c3',
    400: '#8f94a1',
    500: '#717786',
    600: '#5b606e',
    700: '#4a4d5a',
    800: '#40434c',
    900: '#3b3d45',
  },
  dark: {
    50: '#eeeef0',
    100: '#d8dadf',
    200: '#b6b9c3',
    300: '#8f94a1',
    400: '#717786',
    500: '#5b606e',
    600: '#4a4d5a',
    700: '#40434c',
    800: '#3b3d45',
    900: '#25262c',
  },
}

const base: SemanticBaseColors = {
  light: {
    ...semanticColors.light,
    background: {
      DEFAULT: '#f7f8f8',
    },
    foreground: {
      ...gray.light,
      DEFAULT: gray.light[900],
    },
    focus: {
      DEFAULT: primary[600],
    },
    content2: {
      DEFAULT: gray.light[100],
      foreground: gray.light[800],
    },
    content3: {
      DEFAULT: gray.light[200],
      foreground: gray.light[700],
    },
    content4: {
      DEFAULT: gray.light[300],
      foreground: gray.light[600],
    },
  },
  dark: {
    ...semanticColors.dark,
    background: {
      DEFAULT: '#17171c',
    },
    foreground: {
      ...swapColorValues(gray.dark),
      DEFAULT: gray.dark[100],
    },
    focus: {
      DEFAULT: primary[400],
    },
    content1: {
      DEFAULT: gray.dark[900],
      foreground: gray.dark[50],
    },
    content2: {
      DEFAULT: gray.dark[800],
      foreground: gray.dark[100],
    },
    content3: {
      DEFAULT: gray.dark[700],
      foreground: gray.dark[200],
    },
    content4: {
      DEFAULT: gray.dark[600],
      foreground: gray.dark[300],
    },
  },
}

export const themeColorsLight: Partial<ThemeColors> = {
  ...base.light,
  default: {
    ...gray.light,
    foreground: readableColor(gray.light[300]),
    DEFAULT: gray.light[300],
  },
  primary: {
    ...primary,
    foreground: readableColor(primary[600]),
    DEFAULT: primary[600],
  },
  secondary: {
    ...primary,
    foreground: readableColor(secondary[500]),
    DEFAULT: secondary[500],
  },
}

export const themeColorsDark: Partial<ThemeColors> = {
  ...base.dark,
  default: {
    ...swapColorValues(gray.dark),
    foreground: readableColor(gray.dark[600]),
    DEFAULT: gray.dark[600],
  },
  primary: {
    ...swapColorValues(primary),
    foreground: readableColor(primary[400]),
    DEFAULT: primary[400],
  },
  secondary: {
    ...swapColorValues(secondary),
    foreground: readableColor(secondary[300]),
    DEFAULT: secondary[300],
  },
}
