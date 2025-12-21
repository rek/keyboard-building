import React, { useState } from 'react';
import { AssemblyPhase } from '../../types/assembly';
import { StepCard } from './StepCard';

interface PhaseSectionProps {
  phase: AssemblyPhase;
  progress: {
    isComplete: (stepId: string) => boolean;
    toggleStep: (stepId: string) => void;
    getPhaseProgress: (stepIds: string[]) => number;
    isPhaseComplete: (stepIds: string[]) => boolean;
  };
}

export function PhaseSection({ phase, progress }: PhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const stepIds = phase.steps.map((step) => step.id);
  const phaseProgress = progress.getPhaseProgress(stepIds);
  const isPhaseComplete = progress.isPhaseComplete(stepIds);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Phase Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Phase Icon/Number */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              isPhaseComplete
                ? 'bg-green-500'
                : phaseProgress > 0
                ? 'bg-blue-500'
                : 'bg-gray-400'
            }`}
          >
            {isPhaseComplete ? '✓' : phase.order}
          </div>

          {/* Phase Title and Description */}
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">{phase.title}</h2>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-4">
          {/* Progress Circle */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {phaseProgress}%
            </div>
            <div className="text-xs text-gray-500">
              {phase.steps.filter((s) => progress.isComplete(s.id)).length}/
              {phase.steps.length}
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={`transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-6 pb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isPhaseComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
      </div>

      {/* Phase Steps */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
            <span>Estimated time: {phase.estimatedTime}</span>
            <span>{phase.steps.length} steps</span>
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
  );
}
