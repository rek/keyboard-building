import { useEffect } from 'react'

interface ImageModalProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
      }}
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 px-4 py-2 font-bold text-sm tracking-wider transition-colors"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'white',
            background: 'var(--color-accent-orange)',
            border: '2px solid white',
          }}
        >
          [CLOSE] ✕
        </button>

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain"
          style={{
            border: '4px solid white',
          }}
        />

        {/* Image caption */}
        <div
          className="mt-4 px-4 py-2 text-center font-bold tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid white',
          }}
        >
          {alt.toUpperCase()}
        </div>
      </div>
    </div>
  )
}
