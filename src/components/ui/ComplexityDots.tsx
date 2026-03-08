interface ComplexityDotsProps {
  value: number
  size?: 'sm' | 'md'
}

export function ComplexityDots({ value, size = 'sm' }: ComplexityDotsProps) {
  const dim = size === 'md' ? '1rem' : '0.75rem'
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: dim,
            height: dim,
            border: '2px solid var(--color-border)',
            background: i < value ? 'var(--color-accent-orange)' : 'transparent',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}
