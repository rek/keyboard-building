import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useCostEstimate } from '../../hooks/useCostEstimate'
import { useUserChoices } from '../../contexts/UserChoicesContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { checkCompatibility, getCompatibilityStatus } from '../../utils/compatibilityChecker'
import { exportAsJSON, exportAsText } from '../../utils/exportBuildPlan'
import { formatId } from '../../utils/formatting'

const CHOICE_LABELS: Record<string, string> = {
  buildMethod: 'Build Method',
  layout: 'Layout',
  controller: 'Controller',
  switchType: 'Switches',
  connectivity: 'Connectivity',
  firmware: 'Firmware',
}

export function CostEstimator() {
  const { breakdown, total, complexity, buildTimeHours } = useCostEstimate()
  const { choices, isComplete, resetChoices } = useUserChoices()
  const { formatCurrency, currency } = useCurrency()
  const { settings } = useAppSettings()
  const warnings = useMemo(() => checkCompatibility(choices), [choices])
  const compatibilityStatus = getCompatibilityStatus(warnings)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showCompatDetails, setShowCompatDetails] = useState(false)

  const handleExportJSON = () => {
    exportAsJSON(choices, breakdown, total, complexity, buildTimeHours, currency)
    setShowExportMenu(false)
  }

  const handleExportText = () => {
    exportAsText(choices, breakdown, total, complexity, buildTimeHours, currency, formatCurrency)
    setShowExportMenu(false)
  }

  const handleReset = () => {
    resetChoices()
    setShowResetConfirm(false)
  }

  const breakdownItems = [
    { label: 'Controllers', amount: breakdown.controller },
    { label: 'Switches', amount: breakdown.switches },
    { label: 'Keycaps', amount: breakdown.keycaps },
    { label: 'PCB', amount: breakdown.pcb },
    { label: 'Case', amount: breakdown.case },
    { label: 'Hardware', amount: breakdown.hardware },
    { label: 'Features', amount: breakdown.features },
    { label: 'Connectivity', amount: breakdown.connectivity },
    { label: 'Shipping', amount: breakdown.shipping },
    { label: 'Tools (one-time)', amount: breakdown.tools },
  ].filter((item) => item.amount > 0)

  const selectedChoices = [
    { label: CHOICE_LABELS.buildMethod, value: choices.buildMethod },
    { label: CHOICE_LABELS.layout, value: choices.layout.formFactor },
    { label: CHOICE_LABELS.controller, value: choices.controller },
    { label: CHOICE_LABELS.switchType, value: choices.switchType },
    { label: CHOICE_LABELS.connectivity, value: choices.connectivity },
    { label: CHOICE_LABELS.firmware, value: choices.firmware },
  ].filter((item) => item.value !== null)

  return (
    <div
      className="glass-panel p-6 sticky top-4"
      style={{
        border: '3px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <h2
        className="text-xl font-bold mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em',
          color: 'var(--color-text-primary)',
        }}
      >
        {settings.showPricing ? 'BUILD_ESTIMATE' : 'BUILD_SUMMARY'}
      </h2>

      {/* Total Cost */}
      {settings.showPricing && (
        <div
          className="mb-6 p-4 border-2"
          style={{
            borderColor: 'var(--color-accent-orange)',
            background: 'var(--color-accent-orange)',
            color: 'white',
          }}
        >
          <div
            className="text-xs font-bold mb-2 tracking-wide"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TOTAL_COST
          </div>
          <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {formatCurrency(total)}
          </div>
        </div>
      )}

      {/* Compatibility Status */}
      {warnings.length > 0 && (
        <div className="mb-6">
          <div
            className="p-3 border-2"
            style={{
              borderColor:
                compatibilityStatus === 'errors'
                  ? 'var(--color-accent-orange)'
                  : 'var(--color-text-secondary)',
              background: 'var(--color-bg-primary)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{compatibilityStatus === 'errors' ? '⛔' : '⚠️'}</span>
              <span
                className="font-bold text-xs tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color:
                    compatibilityStatus === 'errors'
                      ? 'var(--color-accent-orange)'
                      : 'var(--color-text-primary)',
                }}
              >
                {warnings.length} {warnings.length === 1 ? 'ISSUE' : 'ISSUES'}
              </span>
            </div>
            <button
              onClick={() => setShowCompatDetails((v) => !v)}
              className="text-xs font-bold tracking-wide hover:underline"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-teal)',
              }}
            >
              {showCompatDetails ? 'HIDE_DETAILS' : 'VIEW_DETAILS'}
            </button>
            {showCompatDetails && (
              <ul className="mt-2 space-y-1">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="text-xs pl-2"
                    style={{
                      borderLeft: '2px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {w.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Complexity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-secondary)',
            }}
          >
            COMPLEXITY
          </span>
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            {complexity}/10
          </span>
        </div>
        <div
          className="w-full h-4 border-2"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-primary)',
          }}
        >
          <div
            className="glass-bar h-full transition-all"
            style={{
              width: `${complexity * 10}%`,
              background:
                complexity <= 3
                  ? 'var(--color-accent-teal)'
                  : complexity <= 6
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-accent-orange)',
            }}
          />
        </div>
        <div
          className="text-xs mt-2 font-bold tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {complexity <= 3 ? '[BEGINNER]' : complexity <= 6 ? '[INTERMEDIATE]' : '[ADVANCED]'}
        </div>
      </div>

      {/* Build Time */}
      <div
        className="mb-6 p-4 border-2"
        style={{
          borderColor: 'var(--color-border-light)',
          background: 'var(--color-bg-primary)',
        }}
      >
        <div
          className="text-xs mb-2 font-bold tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)',
          }}
        >
          BUILD_TIME
        </div>
        <div
          className="text-2xl font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-accent-teal)',
          }}
        >
          {buildTimeHours}h
        </div>
        <div
          className="text-xs mt-1 font-bold tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {buildTimeHours < 5 ? '[QUICK]' : buildTimeHours < 20 ? '[WEEKEND]' : '[MULTI_WEEK]'}
        </div>
      </div>

      {/* Selected Choices Summary */}
      {selectedChoices.length > 0 && (
        <div className="mb-6">
          <h3
            className="font-bold mb-3 text-xs tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            [SELECTIONS]
          </h3>
          <div className="space-y-1">
            {selectedChoices.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs pb-1"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <span
                  className="font-bold tracking-wide"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {item.label.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent-teal)',
                  }}
                >
                  {formatId(item.value!)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {settings.showPricing && breakdownItems.length > 0 && (
        <div className="mb-6">
          <h3
            className="font-bold mb-3 text-xs tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            [BREAKDOWN]
          </h3>
          <div className="space-y-2">
            {breakdownItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm pb-2"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {item.label.toUpperCase()}
                </span>
                <span
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Export Button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="w-full px-4 py-3 border-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] font-bold text-sm tracking-wide flex items-center justify-center gap-2"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            EXPORT_PLAN
            <span className="text-xs">▼</span>
          </button>

          {showExportMenu && (
            <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div
                className="glass-panel absolute bottom-full mb-2 left-0 right-0 border-2 z-20 overflow-hidden"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <button
                  onClick={handleExportJSON}
                  className="w-full px-4 py-3 text-left transition-all hover:bg-opacity-50"
                  style={{
                    borderBottom: '2px solid var(--color-border-light)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-bg-primary)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="font-bold text-sm tracking-wide"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    JSON
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Machine-readable
                  </div>
                </button>
                <button
                  onClick={handleExportText}
                  className="w-full px-4 py-3 text-left transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-bg-primary)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="font-bold text-sm tracking-wide"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    TEXT
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Human-readable
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Assembly Guide Button */}
        {isComplete && (
          <Link
            to="/assembly"
            className="w-full px-4 py-3 border-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-3"
            style={{
              borderColor: 'var(--color-accent-teal)',
              background: 'var(--color-accent-teal)',
              color: 'white',
              fontFamily: 'var(--font-display)',
            }}
          >
            <span>📖</span>
            ASSEMBLY_GUIDE
            <span>→</span>
          </Link>
        )}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full text-xs underline text-center mt-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)',
          }}
        >
          RESET_CHOICES
        </button>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div
            className="glass-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <div
              className="glass-panel p-6 max-w-sm w-full"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '3px solid var(--color-border)',
              }}
            >
              <h3
                className="font-bold text-lg mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                RESET_ALL?
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 border-2 font-bold text-sm tracking-wide transition-all"
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
                  onClick={handleReset}
                  className="flex-1 py-2 border-2 font-bold text-sm tracking-wide transition-all"
                  style={{
                    borderColor: 'var(--color-accent-orange)',
                    background: 'var(--color-accent-orange)',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  YES_RESET
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
