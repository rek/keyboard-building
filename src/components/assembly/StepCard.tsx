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
      className={`border-2 rounded-lg p-5 transition-all ${
        isComplete
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-3">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            isComplete
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {isComplete && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Step Title and Description */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
          {step.estimatedTime && (
            <div className="text-xs text-gray-500">
              ⏱️ {step.estimatedTime}
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="prose prose-sm max-w-none mb-4 pl-10">
        {step.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-gray-700 mb-2 whitespace-pre-line">
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
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                🔧 {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warning and Tips Toggles */}
      <div className="pl-10 space-y-2">
        {/* Warnings */}
        {hasWarnings && (
          <div>
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="flex items-center gap-2 text-sm font-semibold text-yellow-800 hover:text-yellow-900"
            >
              <span>⚠️</span>
              <span>Warnings ({step.warnings?.length})</span>
              <span className="text-xs">
                {showWarnings ? '▼' : '▶'}
              </span>
            </button>
            {showWarnings && (
              <ul className="mt-2 ml-6 space-y-1 text-sm bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                {step.warnings?.map((warning, idx) => (
                  <li key={idx} className="text-yellow-900">
                    • {warning}
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
              className="flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-900"
            >
              <span>💡</span>
              <span>Pro Tips ({step.tips?.length})</span>
              <span className="text-xs">
                {showTips ? '▼' : '▶'}
              </span>
            </button>
            {showTips && (
              <ul className="mt-2 ml-6 space-y-1 text-sm bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                {step.tips?.map((tip, idx) => (
                  <li key={idx} className="text-blue-900">
                    • {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* External Links */}
        {hasLinks && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              🔗 External Resources
            </div>
            <div className="space-y-2">
              {step.externalLinks?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-600 text-sm">
                        {link.title}
                        <span className="ml-1 text-xs text-gray-500">↗</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {link.description}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded border border-gray-200">
                      {link.type}
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
