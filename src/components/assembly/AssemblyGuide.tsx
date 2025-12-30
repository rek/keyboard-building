import React from 'react';
import { useUserChoices } from '../../contexts/UserChoicesContext';
import { useAssemblySteps } from '../../hooks/useAssemblySteps';
import { useAssemblyProgress } from '../../hooks/useAssemblyProgress';
import { PhaseSection } from './PhaseSection';

export function AssemblyGuide() {
  const { choices } = useUserChoices();
  const { phases, totalSteps } = useAssemblySteps();
  const progress = useAssemblyProgress(choices);

  const overallProgress = progress.getOverallProgress(totalSteps);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.02em',
            color: 'var(--color-text-primary)'
          }}
        >
          [ASSEMBLY_GUIDE]
        </h1>
        <p
          className="font-medium"
          style={{
            color: 'var(--color-accent-orange)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.03em'
          }}
        >
          // Step-by-step instructions customized for your build configuration
        </p>
      </div>

      {/* Build Summary */}
      <div
        className="p-6 mb-8"
        style={{
          border: '3px solid var(--color-border)',
          background: 'var(--color-bg-secondary)'
        }}
      >
        <h2
          className="text-xl font-bold mb-4 tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)'
          }}
        >
          [YOUR_BUILD]
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {choices.buildMethod && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                BUILD_METHOD:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.buildMethod)}
              </div>
            </div>
          )}
          {choices.layout.formFactor && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                LAYOUT:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.layout.formFactor)}
              </div>
            </div>
          )}
          {choices.controller && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                CONTROLLER:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.controller)}
              </div>
            </div>
          )}
          {choices.switchType && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                SWITCHES:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.switchType)}
              </div>
            </div>
          )}
          {choices.connectivity && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                CONNECTIVITY:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.connectivity)}
              </div>
            </div>
          )}
          {choices.firmware && (
            <div>
              <div
                className="text-xs font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                FIRMWARE:
              </div>
              <div
                className="font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {formatId(choices.firmware)}
              </div>
            </div>
          )}
        </div>

        {/* Features if any enabled */}
        {Object.values(choices.features).some((f) => f) && (
          <div
            className="mt-4 pt-4"
            style={{ borderTop: '2px solid var(--color-border-light)' }}
          >
            <div
              className="text-xs font-bold mb-3 tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-secondary)'
              }}
            >
              FEATURES:
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(choices.features)
                .filter(([_, enabled]) => enabled)
                .map(([feature]) => (
                  <span
                    key={feature}
                    className="px-3 py-1 border-2 text-xs font-bold tracking-wide"
                    style={{
                      borderColor: 'var(--color-accent-teal)',
                      background: 'transparent',
                      color: 'var(--color-accent-teal)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {formatId(feature).toUpperCase()}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div
        className="p-6 mb-8"
        style={{
          border: '3px solid var(--color-border)',
          background: 'var(--color-bg-secondary)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)'
            }}
          >
            [OVERALL_PROGRESS]
          </h2>
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-accent-teal)'
            }}
          >
            {overallProgress}%
          </span>
        </div>
        <div
          className="w-full h-4 border-2 mb-3"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-primary)'
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${overallProgress}%`,
              background: 'var(--color-accent-teal)'
            }}
          />
        </div>
        <div
          className="text-sm font-bold tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)'
          }}
        >
          [{progress.completedSteps.length}/{totalSteps}] STEPS_COMPLETED
        </div>
      </div>

      {/* Assembly Phases */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <PhaseSection key={phase.id} phase={phase} progress={progress} />
        ))}
      </div>

      {/* Footer Tips */}
      <div
        className="mt-8 p-6"
        style={{
          border: '3px solid var(--color-accent-teal)',
          background: 'var(--color-bg-secondary)'
        }}
      >
        <h3
          className="font-bold mb-4 text-sm tracking-wide"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)'
          }}
        >
          [TIPS_FOR_SUCCESS]
        </h3>
        <ul className="space-y-2 text-sm">
          <li
            className="flex items-start gap-3 pl-4"
            style={{
              borderLeft: '2px solid var(--color-accent-teal)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
              [01]
            </span>
            <span>Read each step completely before starting</span>
          </li>
          <li
            className="flex items-start gap-3 pl-4"
            style={{
              borderLeft: '2px solid var(--color-accent-teal)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
              [02]
            </span>
            <span>Take breaks every 45-60 minutes</span>
          </li>
          <li
            className="flex items-start gap-3 pl-4"
            style={{
              borderLeft: '2px solid var(--color-accent-teal)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
              [03]
            </span>
            <span>Take photos at each major step for documentation</span>
          </li>
          <li
            className="flex items-start gap-3 pl-4"
            style={{
              borderLeft: '2px solid var(--color-accent-teal)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
              [04]
            </span>
            <span>Test thoroughly before final case assembly</span>
          </li>
          <li
            className="flex items-start gap-3 pl-4"
            style={{
              borderLeft: '2px solid var(--color-accent-teal)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
              [05]
            </span>
            <span>Ask for help in keyboard building communities if stuck</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function formatId(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
