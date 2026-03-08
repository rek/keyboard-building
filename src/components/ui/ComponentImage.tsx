interface ComponentImageProps {
  src: string
  alt: string
  height?: string
}

export function ComponentImage({ src, alt, height = 'h-32' }: ComponentImageProps) {
  return (
    <div
      className={`w-full ${height} flex items-center justify-center overflow-hidden border-2`}
      style={{ borderColor: 'var(--color-border-light)' }}
    >
      <img src={src} alt={alt} className="w-full h-full object-contain p-2" />
    </div>
  )
}

export function ComponentImagePlaceholder({ height = 'h-32' }: { height?: string }) {
  return (
    <div
      className={`w-full ${height} flex items-center justify-center overflow-hidden border-2`}
      style={{
        background: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-light)',
      }}
    >
      <span
        className="text-xs font-bold tracking-wide"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}
      >
        [IMG]
      </span>
    </div>
  )
}
