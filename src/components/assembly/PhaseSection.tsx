import React, { useState } from 'react'
import { type AssemblyPhase } from '../../types/assembly'
import { StepCard } from './StepCard'

interface PhaseSectionProps {
  phase: AssemblyPhase
  progress: {
    isComplete: (stepId: string) => boolean
    toggleStep: (stepId: string) => void
    getPhaseProgress: (stepIds: string[]) => number
    isPhaseComplete: (stepIds: string[]) => boolean
  }
}

export function PhaseSection({ phase, progress }: PhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const stepIds = phase.steps.map((step) => step.id)
  const phaseProgress = progress.getPhaseProgress(stepIds)
  const isPhaseComplete = progress.isPhaseComplete(stepIds)

  return (
    <div
      style={{
        border: '3px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      {/* Phase Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center gap-4">
          {/* Phase Icon/Number */}
          <div
            className="w-10 h-10 border-2 flex items-center justify-center font-bold"
            style={{
              borderColor: isPhaseComplete
                ? 'var(--color-accent-teal)'
                : phaseProgress > 0
                  ? 'var(--color-accent-orange)'
                  : 'var(--color-border)',
              background: isPhaseComplete
                ? 'var(--color-accent-teal)'
                : phaseProgress > 0
                  ? 'var(--color-accent-orange)'
                  : 'transparent',
              color: isPhaseComplete || phaseProgress > 0 ? 'white' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {isPhaseComplete ? '✓' : `${phase.order}`.padStart(2, '0')}
          </div>

          {/* Phase Title and Description */}
          <div className="text-left">
            <h2
              className="text-xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              {phase.title.toUpperCase()}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {phase.description}
            </p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-teal)',
              }}
            >
              {phaseProgress}%
            </div>
            <div
              className="text-xs font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-secondary)',
              }}
            >
              [{phase.steps.filter((s) => progress.isComplete(s.id)).length}/{phase.steps.length}]
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className="transform transition-transform"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              ▼
            </span>
          </div>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-6 pb-3">
        <div
          className="w-full h-2 border-2"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-primary)',
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${phaseProgress}%`,
              background: isPhaseComplete
                ? 'var(--color-accent-teal)'
                : 'var(--color-accent-orange)',
            }}
          />
        </div>
      </div>

      {/* Phase Steps */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 space-y-4">
          <div
            className="flex items-center justify-between text-sm pb-3"
            style={{ borderBottom: '2px solid var(--color-border-light)' }}
          >
            <span
              className="font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-secondary)',
              }}
            >
              ⏱️ ESTIMATED_TIME: {phase.estimatedTime}
            </span>
            <span
              className="font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-secondary)',
              }}
            >
              [{phase.steps.length}] STEPS
            </span>
          </div>

          {phase.steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isComplete={progress.isComplete(step.id)}
              onToggleComplete={() => progress.toggleStep(step.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
