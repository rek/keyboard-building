import { useState } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { ImageModal } from '../common/ImageModal'
import { getImageUrl } from '../../utils/images'
import { ComplexityDots } from '../ui/ComplexityDots'
import { SectionLabel } from '../ui/SectionLabel'
import { PillTag } from '../ui/PillTag'
import { AccentedListItem } from '../ui/AccentedListItem'
import { ComponentImagePlaceholder } from '../ui/ComponentImage'

interface ComponentCardProps {
  component: {
    id: string
    name: string
    price: number
    priceUnit?: string
    image: string
    complexity: number
    specs?: Record<string, any>
    pros: string[]
    cons: string[]
    compatibleWith?: string[]
    incompatibleWith?: string[]
  }
  category: string
  onClick?: () => void
}

export function ComponentCard({ component, category, onClick }: ComponentCardProps) {
  const { formatCurrency } = useCurrency()
  const { settings } = useAppSettings()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden transition-all tech-card group"
      style={{
        border: '3px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      {/* Image */}
      <div
        className="w-full h-48 flex items-center justify-center overflow-hidden relative group/image"
        style={{ borderBottom: '3px solid var(--color-border)' }}
      >
        {component.image ? (
          <div
            className="w-full h-full relative cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation()
              setIsImageModalOpen(true)
            }}
          >
            <img
              src={getImageUrl(component.image)}
              alt={component.name}
              className="w-full h-full object-contain p-4 transition-transform group-hover/image:scale-105"
            />
            {/* Zoom indicator */}
            <div
              className="absolute bottom-2 right-2 px-2 py-1 text-xs font-bold tracking-wider opacity-0 group-hover/image:opacity-100 transition-opacity"
              style={{
                background: 'var(--color-accent-orange)',
                color: 'white',
                fontFamily: 'var(--font-display)',
              }}
            >
              🔍 CLICK TO ENLARGE
            </div>
          </div>
        ) : (
          <ComponentImagePlaceholder height="h-48" />
        )}
        {/* Category badge */}
        <div
          className="absolute top-2 right-2 px-2 py-1 text-xs font-bold tracking-wider"
          style={{
            background: 'var(--color-accent-teal)',
            color: 'white',
            fontFamily: 'var(--font-display)',
          }}
        >
          {category.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h3
            className="font-bold text-base mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            {component.name.toUpperCase()}
          </h3>

          {/* Price */}
          {settings.showPricing && (
            <div
              className="font-bold text-lg"
              style={{
                color: 'var(--color-accent-orange)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {formatCurrency(component.price)}
              {component.priceUnit && (
                <span className="text-xs ml-1" style={{ color: 'var(--color-text-secondary)' }}>
                  /{component.priceUnit}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Complexity */}
        <div className="mb-4">
          <SectionLabel className="mb-2">COMPLEXITY</SectionLabel>
          <ComplexityDots value={component.complexity} size="md" />
        </div>

        {/* Specs Preview */}
        {component.specs && (
          <div
            className="mb-4 p-3 space-y-1.5"
            style={{
              border: '2px solid var(--color-border-light)',
              background: 'var(--color-bg-primary)',
            }}
          >
            {Object.entries(component.specs)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span
                    className="font-bold tracking-wide"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {key.replace(/([A-Z])/g, '_$1').toUpperCase()}:
                  </span>
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {typeof value === 'boolean'
                      ? value
                        ? 'YES'
                        : 'NO'
                      : String(value).toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Pros (top 2) */}
        {component.pros.length > 0 && (
          <div className="mb-3">
            <SectionLabel color="var(--color-accent-teal)" className="mb-2">
              [+] PROS
            </SectionLabel>
            <ul className="space-y-1.5">
              {component.pros.slice(0, 2).map((pro, index) => (
                <AccentedListItem key={index} size="xs">
                  {pro}
                </AccentedListItem>
              ))}
            </ul>
          </div>
        )}

        {/* Cons (top 2) */}
        {component.cons.length > 0 && (
          <div className="mb-4">
            <SectionLabel color="var(--color-accent-orange)" className="mb-2">
              [-] CONS
            </SectionLabel>
            <ul className="space-y-1.5">
              {component.cons.slice(0, 2).map((con, index) => (
                <AccentedListItem key={index} accent="var(--color-accent-orange)" size="xs">
                  {con}
                </AccentedListItem>
              ))}
            </ul>
          </div>
        )}

        {/* Compatibility Tags */}
        {(component.compatibleWith || component.incompatibleWith) && (
          <div
            className="flex flex-wrap gap-2 pt-3"
            style={{ borderTop: '2px solid var(--color-border-light)' }}
          >
            {component.compatibleWith?.slice(0, 3).map((item) => (
              <PillTag key={item} variant="teal">
                {item.toUpperCase()}
              </PillTag>
            ))}
            {component.incompatibleWith?.slice(0, 2).map((item) => (
              <PillTag key={item} variant="incompatible">
                {item.toUpperCase()}
              </PillTag>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && component.image && (
        <ImageModal
          src={getImageUrl(component.image)}
          alt={component.name}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  )
}
