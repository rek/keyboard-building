export const THEMES = {
  light: {
    label: 'VINTAGE',
    accent: '#ff6b35',
  },
  dark: {
    label: 'TERMINAL',
    accent: '#ff8c42',
  },
  blueprint: {
    label: 'BLUEPRINT',
    accent: '#ffd700',
  },
  neumorphic: {
    label: 'SOFT UI',
    accent: '#6c7ee1',
  },
} as const

export type Theme = keyof typeof THEMES
