import type { ReactNode } from 'react'

interface AccentedListItemProps {
  children: ReactNode
  accent?: string
  size?: 'xs' | 'sm'
}

export function AccentedListItem({
  children,
  accent = 'var(--color-accent-teal)',
  size = 'sm',
}: AccentedListItemProps) {
  return (
    <li
      className={`flex items-start gap-2 pl-3 text-${size}`}
      style={{
        borderLeft: `2px solid ${accent}`,
        color: 'var(--color-text-secondary)',
      }}
    >
      {children}
    </li>
  )
}
