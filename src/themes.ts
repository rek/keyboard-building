export const THEMES = {
  light: {
    label: 'VINTAGE',
    accent: '#ff6b35',
  },
  dark: {
    label: 'TERMINAL',
    accent: '#00ff41',
  },
  neumorphic: {
    label: 'SOFT UI',
    accent: '#6c7ee1',
  },
} as const

export type Theme = keyof typeof THEMES
