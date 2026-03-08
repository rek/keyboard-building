import { useEffect } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { ComplexityDots } from '../ui/ComplexityDots'
import { SectionLabel } from '../ui/SectionLabel'
import { PillTag } from '../ui/PillTag'
import { AccentedListItem } from '../ui/AccentedListItem'

export interface ConsequencePreviewData {
  decision: string
  option: {
    id: string
    name: string
    shortDesc: string
    costDelta: number
    complexityDelta: number
    timeHours: number
    skillLevel: string
    requiredTools: string[]
    downstreamEffects: string[]
  }
  warnings: {
    severity: 'error' | 'warning' | 'info'
    message: string
  }[]
}

interface ConsequencePreviewProps {
  data: ConsequencePreviewData | null
  onClose: () => void
  onConfirm: () => void
}

export function ConsequencePreview({ data, onClose, onConfirm }: ConsequencePreviewProps) {
  const { formatCurrency } = useCurrency()
  const { settings } = useAppSettings()

  useEffect(() => {
    if (!data) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [data, onClose])

  if (!data) return null

  const { option, warnings } = data

  const warningBorderColor = (severity: 'error' | 'warning' | 'info') => {
    if (severity === 'error') return 'var(--color-accent-orange)'
    if (severity === 'warning') return 'var(--color-text-secondary)'
    return 'var(--color-accent-teal)'
  }

  return (
    <div
      className="glass-overlay fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      role="button"
      tabIndex={0}
      aria-label="Close"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose()
      }}
    >
      <div
        role="presentation"
        className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-secondary)',
          border: '3px solid var(--color-border)',
          color: 'var(--color-text-primary)',
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {option.name.toUpperCase()}
              </h2>
              <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {option.shortDesc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl leading-none p-1 transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Quick Stats */}
          <div
            className={`grid ${settings.showPricing ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6 p-4`}
            style={{
              background: 'var(--color-bg-primary)',
              border: '2px solid var(--color-border-light)',
            }}
          >
            {settings.showPricing && (
              <div>
                <SectionLabel className="mb-1">COST_IMPACT</SectionLabel>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-orange)' }}
                >
                  +{formatCurrency(option.costDelta)}
                </div>
              </div>
            )}
            <div>
              <SectionLabel className="mb-1">BUILD_TIME</SectionLabel>
              <div
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-teal)' }}
              >
                {option.timeHours}h
              </div>
            </div>
            <div>
              <SectionLabel className="mb-1">COMPLEXITY</SectionLabel>
              <div className="mt-1">
                <ComplexityDots value={option.complexityDelta} />
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="mb-6">
            <SectionLabel className="mb-2">SKILL_LEVEL</SectionLabel>
            <PillTag>{option.skillLevel.toUpperCase()}</PillTag>
          </div>

          {/* Required Tools */}
          {option.requiredTools.length > 0 && (
            <div className="mb-6">
              <SectionLabel className="mb-2">YOU_WILL_NEED</SectionLabel>
              <ul className="space-y-1">
                {option.requiredTools.map((tool, index) => (
                  <AccentedListItem key={index}>{tool}</AccentedListItem>
                ))}
              </ul>
            </div>
          )}

          {/* Downstream Effects */}
          {option.downstreamEffects.length > 0 && (
            <div className="mb-6">
              <SectionLabel className="mb-2">THIS_WILL_AFFECT</SectionLabel>
              <ul className="space-y-1">
                {option.downstreamEffects.map((effect, index) => (
                  <AccentedListItem key={index} accent="var(--color-border)">
                    {effect}
                  </AccentedListItem>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-6">
              <SectionLabel className="mb-2">COMPATIBILITY_WARNINGS</SectionLabel>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-3"
                    style={{
                      borderLeft: `4px solid ${warningBorderColor(warning.severity)}`,
                      background: 'var(--color-bg-primary)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {warning.severity === 'error'
                          ? '⛔'
                          : warning.severity === 'warning'
                            ? '⚠️'
                            : 'ℹ️'}
                      </span>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {warning.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex gap-3 pt-4"
            style={{ borderTop: '2px solid var(--color-border-light)' }}
          >
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 font-bold text-sm tracking-wide transition-all"
              style={{
                borderColor: 'var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              disabled={warnings.some((w) => w.severity === 'error')}
              className="flex-1 px-4 py-2 border-2 font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: warnings.some((w) => w.severity === 'error')
                  ? 'var(--color-border)'
                  : 'var(--color-accent-teal)',
                background: warnings.some((w) => w.severity === 'error')
                  ? 'transparent'
                  : 'var(--color-accent-teal)',
                color: warnings.some((w) => w.severity === 'error')
                  ? 'var(--color-text-secondary)'
                  : 'white',
                fontFamily: 'var(--font-display)',
              }}
            >
              {warnings.some((w) => w.severity === 'error') ? 'INCOMPATIBLE' : 'CHOOSE_THIS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
