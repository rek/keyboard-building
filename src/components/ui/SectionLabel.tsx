import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  color?: string
  className?: string
}

export function SectionLabel({
  children,
  color = 'var(--color-text-secondary)',
  className = '',
}: SectionLabelProps) {
  return (
    <div
      className={`text-xs font-bold tracking-wide ${className}`}
      style={{ fontFamily: 'var(--font-display)', color }}
    >
      {children}
    </div>
  )
}
