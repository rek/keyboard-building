import type { ReactNode } from 'react'

interface PillTagProps {
  children: ReactNode
  variant?: 'teal' | 'orange' | 'neutral' | 'incompatible'
  className?: string
}

const variants = {
  teal: {
    border: '2px solid var(--color-accent-teal)',
    color: 'var(--color-accent-teal)',
  },
  orange: {
    border: '2px solid var(--color-accent-orange)',
    color: 'var(--color-accent-orange)',
  },
  neutral: {
    border: '2px solid var(--color-border-light)',
    color: 'var(--color-text-secondary)',
  },
  incompatible: {
    border: '2px solid var(--color-border-light)',
    color: 'var(--color-text-secondary)',
    opacity: 0.5,
    textDecoration: 'line-through' as const,
  },
}

export function PillTag({ children, variant = 'teal', className = '' }: PillTagProps) {
  return (
    <span
      className={`px-2 py-1 text-xs font-bold tracking-wide ${className}`}
      style={{
        background: 'transparent',
        fontFamily: 'var(--font-display)',
        ...variants[variant],
      }}
    >
      {children}
    </span>
  )
}
