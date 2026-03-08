const badgeBase: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  padding: '2px 6px',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: 'white',
  fontFamily: 'var(--font-display)',
  lineHeight: 1.4,
  pointerEvents: 'none',
}

export function SelectedBadge() {
  return (
    <div
      style={{
        ...badgeBase,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        background: 'var(--color-accent-orange)',
      }}
    >
      ✓
    </div>
  )
}

export function IncompatBadge({ title }: { title?: string }) {
  return (
    <div style={{ ...badgeBase, background: '#dc2626' }} title={title}>
      INCOMPAT
    </div>
  )
}

export function CautionBadge({ title }: { title?: string }) {
  return (
    <div style={{ ...badgeBase, background: '#d97706' }} title={title}>
      CAUTION
    </div>
  )
}
