import React, { useState } from 'react';
import { AssemblyStep } from '../../types/assembly';

interface StepCardProps {
  step: AssemblyStep;
  isComplete: boolean;
  onToggleComplete: () => void;
}

export function StepCard({ step, isComplete, onToggleComplete }: StepCardProps) {
  const [showWarnings, setShowWarnings] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const hasWarnings = step.warnings && step.warnings.length > 0;
  const hasTips = step.tips && step.tips.length > 0;
  const hasLinks = step.externalLinks && step.externalLinks.length > 0;
  const hasTools = step.requiredTools && step.requiredTools.length > 0;

  return (
    <div
      className="border-2 p-5 transition-all"
      style={{
        borderColor: isComplete
          ? 'var(--color-accent-teal)'
          : 'var(--color-border)',
        background: isComplete
          ? 'var(--color-bg-primary)'
          : 'var(--color-bg-secondary)'
      }}
    >
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-3">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          className="mt-1 w-6 h-6 border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: isComplete
              ? 'var(--color-accent-teal)'
              : 'var(--color-border)',
            background: isComplete
              ? 'var(--color-accent-teal)'
              : 'transparent'
          }}
        >
          {isComplete && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Step Title and Description */}
        <div className="flex-1">
          <h3
            className="text-lg font-bold mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)'
            }}
          >
            {step.title.toUpperCase()}
          </h3>
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            {step.description}
          </p>
          {step.estimatedTime && (
            <div
              className="text-xs font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-secondary)'
              }}
            >
              ⏱️ {step.estimatedTime}
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="prose prose-sm max-w-none mb-4 pl-10">
        {step.content.split('\n\n').map((paragraph, idx) => (
          <p
            key={idx}
            className="mb-2 whitespace-pre-line leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Required Tools */}
      {hasTools && (
        <div className="pl-10 mb-3">
          <div className="flex flex-wrap gap-2">
            {step.requiredTools?.map((tool, idx) => (
              <span
                key={idx}
                className="px-2 py-1 border-2 text-xs font-bold tracking-wide"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-primary)',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-display)'
                }}
              >
                🔧 {tool.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warning and Tips Toggles */}
      <div className="pl-10 space-y-3">
        {/* Warnings */}
        {hasWarnings && (
          <div>
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="flex items-center gap-2 text-sm font-bold tracking-wide transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-orange)'
              }}
            >
              <span>⚠️</span>
              <span>[WARNINGS] ({step.warnings?.length})</span>
              <span className="text-xs">
                {showWarnings ? '▼' : '▶'}
              </span>
            </button>
            {showWarnings && (
              <ul
                className="mt-2 ml-6 space-y-2 text-sm p-3 border-l-4"
                style={{
                  borderColor: 'var(--color-accent-orange)',
                  background: 'var(--color-bg-primary)'
                }}
              >
                {step.warnings?.map((warning, idx) => (
                  <li
                    key={idx}
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span className="font-bold" style={{ color: 'var(--color-accent-orange)' }}>
                      &gt;
                    </span>{' '}
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tips */}
        {hasTips && (
          <div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-2 text-sm font-bold tracking-wide transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-teal)'
              }}
            >
              <span>💡</span>
              <span>[PRO_TIPS] ({step.tips?.length})</span>
              <span className="text-xs">
                {showTips ? '▼' : '▶'}
              </span>
            </button>
            {showTips && (
              <ul
                className="mt-2 ml-6 space-y-2 text-sm p-3 border-l-4"
                style={{
                  borderColor: 'var(--color-accent-teal)',
                  background: 'var(--color-bg-primary)'
                }}
              >
                {step.tips?.map((tip, idx) => (
                  <li
                    key={idx}
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
                      &gt;
                    </span>{' '}
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* External Links */}
        {hasLinks && (
          <div
            className="mt-3 pt-3"
            style={{ borderTop: '2px solid var(--color-border-light)' }}
          >
            <div
              className="text-sm font-bold mb-3 tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)'
              }}
            >
              🔗 [EXTERNAL_RESOURCES]
            </div>
            <div className="space-y-2">
              {step.externalLinks?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-bg-primary)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="font-bold text-sm mb-1"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-accent-teal)'
                        }}
                      >
                        {link.title.toUpperCase()}
                        <span className="ml-1 text-xs">↗</span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {link.description}
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-1 border-2 font-bold tracking-wide"
                      style={{
                        borderColor: 'var(--color-border)',
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      {link.type.toUpperCase()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
