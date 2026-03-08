import React, { useState } from 'react'
import { useUserChoices } from '../../contexts/UserChoicesContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAppSettings } from '../../contexts/AppSettingsContext'
import { ConsequencePreview, type ConsequencePreviewData } from './ConsequencePreview'
import { checkCompatibility } from '../../utils/compatibilityChecker'
import decisionTreeData from '../../data/decision-trees.json'
import { getImageUrl } from '../../utils/images'

interface DecisionStep {
  id: string
  title: string
  description: string
  order: number
  options: {
    id: string
    name: string
    shortDesc: string
    image: string
    costDelta: number
    complexityDelta: number
    timeHours: number
    skillLevel: string
    requiredTools: string[]
    downstreamEffects: string[]
  }[]
}

export function DecisionTree() {
  const { choices, updateChoice } = useUserChoices()
  const { formatCurrency } = useCurrency()
  const { settings } = useAppSettings()
  const [previewData, setPreviewData] = useState<ConsequencePreviewData | null>(null)
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null)

  const steps: DecisionStep[] = decisionTreeData.steps

  const applyDecisionToChoices = (
    currentChoices: typeof choices,
    decisionId: string,
    optionId: string
  ): typeof choices => {
    if (decisionId === 'layout') {
      return { ...currentChoices, layout: { ...currentChoices.layout, formFactor: optionId } }
    }
    const keyMap: Partial<Record<string, keyof typeof choices>> = {
      buildMethod: 'buildMethod',
      controller: 'controller',
      switches: 'switchType',
      connectivity: 'connectivity',
      firmware: 'firmware',
    }
    const key = keyMap[decisionId]
    if (key) return { ...currentChoices, [key]: optionId }
    return currentChoices
  }

  const handlePreview = (decision: DecisionStep, option: DecisionStep['options'][0]) => {
    const tempChoices = applyDecisionToChoices(choices, decision.id, option.id)
    const warnings = checkCompatibility(tempChoices)
    setPreviewData({ decision: decision.title, option, warnings })
    setSelectedDecisionId(decision.id)
  }

  const handleConfirm = () => {
    if (!previewData || !selectedDecisionId) return
    const updated = applyDecisionToChoices(choices, selectedDecisionId, previewData.option.id)

    if (selectedDecisionId === 'layout') {
      updateChoice('layout', updated.layout)
    } else {
      const keyMap: Partial<Record<string, keyof typeof choices>> = {
        buildMethod: 'buildMethod',
        controller: 'controller',
        switches: 'switchType',
        connectivity: 'connectivity',
        firmware: 'firmware',
      }
      const key = keyMap[selectedDecisionId]
      if (key) updateChoice(key, updated[key])
    }

    setPreviewData(null)
    setSelectedDecisionId(null)
  }

  const handleClosePreview = () => {
    setPreviewData(null)
    setSelectedDecisionId(null)
  }

  const getCurrentValue = (decisionId: string): string | null => {
    if (decisionId === 'buildMethod') return choices.buildMethod
    if (decisionId === 'layout') return choices.layout.formFactor
    if (decisionId === 'controller') return choices.controller
    if (decisionId === 'switches') return choices.switchType
    if (decisionId === 'connectivity') return choices.connectivity
    if (decisionId === 'firmware') return choices.firmware
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        {steps.map((decision, stepIndex) => {
          const currentValue = getCurrentValue(decision.id)
          const isCompleted = currentValue !== null

          return (
            <div
              key={decision.id}
              className="p-6"
              style={{
                border: '3px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
              }}
            >
              {/* Step Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-lg font-bold border-2"
                    style={{
                      borderColor: isCompleted ? 'var(--color-accent-teal)' : 'var(--color-border)',
                      background: isCompleted ? 'var(--color-accent-teal)' : 'transparent',
                      color: isCompleted ? 'white' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {isCompleted ? '✓' : `${stepIndex + 1}`.padStart(2, '0')}
                  </div>
                  <div>
                    <h2
                      className="text-xl md:text-2xl font-bold mb-2"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.02em',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {decision.title.toUpperCase()}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{decision.description}</p>
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {decision.options.map((option) => {
                  const isSelected = currentValue === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePreview(decision, option)}
                      className="relative text-left p-4 border-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      style={{
                        borderColor: isSelected
                          ? 'var(--color-accent-orange)'
                          : 'var(--color-border)',
                        background: isSelected
                          ? 'var(--color-bg-primary)'
                          : 'var(--color-bg-secondary)',
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center font-bold text-xs"
                          style={{
                            background: 'var(--color-accent-orange)',
                            color: 'white',
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          ✓
                        </div>
                      )}

                      {/* Option Image */}
                      <div
                        className="w-full h-32 mb-3 flex items-center justify-center overflow-hidden border-2"
                        style={{
                          background: 'var(--color-bg-primary)',
                          borderColor: 'var(--color-border-light)',
                        }}
                      >
                        {option.image ? (
                          <img
                            src={getImageUrl(option.image)}
                            alt={option.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span
                            className="text-xs font-bold tracking-wide"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            [IMG]
                          </span>
                        )}
                      </div>

                      {/* Option Title */}
                      <h3
                        className="font-bold mb-2 text-sm"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-text-primary)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {option.name.toUpperCase()}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        {option.shortDesc}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between text-sm mb-2">
                        {settings.showPricing && (
                          <span
                            className="font-bold"
                            style={{
                              color: 'var(--color-accent-orange)',
                              fontFamily: 'var(--font-display)',
                            }}
                          >
                            +{formatCurrency(option.costDelta)}
                          </span>
                        )}
                        <div
                          className={`flex items-center gap-1 ${!settings.showPricing ? 'ml-auto' : ''}`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 border"
                              style={{
                                borderColor: 'var(--color-border)',
                                background:
                                  i < option.complexityDelta
                                    ? 'var(--color-accent-orange)'
                                    : 'transparent',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Skill Level Badge */}
                      <div className="mt-2">
                        <span
                          className="inline-block px-2 py-1 text-xs font-bold tracking-wide border-2"
                          style={{
                            borderColor: 'var(--color-border-light)',
                            background: 'transparent',
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          {option.skillLevel.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Consequence Preview Modal */}
      <ConsequencePreview
        data={previewData}
        onClose={handleClosePreview}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
