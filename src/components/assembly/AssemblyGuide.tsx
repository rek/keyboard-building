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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Assembly Guide
        </h1>
        <p className="text-gray-600">
          Step-by-step instructions customized for your build configuration
        </p>
      </div>

      {/* Build Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Build</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {choices.buildMethod && (
            <div>
              <div className="text-sm text-gray-600">Build Method</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.buildMethod)}
              </div>
            </div>
          )}
          {choices.layout.formFactor && (
            <div>
              <div className="text-sm text-gray-600">Layout</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.layout.formFactor)}
              </div>
            </div>
          )}
          {choices.controller && (
            <div>
              <div className="text-sm text-gray-600">Controller</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.controller)}
              </div>
            </div>
          )}
          {choices.switchType && (
            <div>
              <div className="text-sm text-gray-600">Switches</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.switchType)}
              </div>
            </div>
          )}
          {choices.connectivity && (
            <div>
              <div className="text-sm text-gray-600">Connectivity</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.connectivity)}
              </div>
            </div>
          )}
          {choices.firmware && (
            <div>
              <div className="text-sm text-gray-600">Firmware</div>
              <div className="font-semibold text-gray-900">
                {formatId(choices.firmware)}
              </div>
            </div>
          )}
        </div>

        {/* Features if any enabled */}
        {Object.values(choices.features).some((f) => f) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Features</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(choices.features)
                .filter(([_, enabled]) => enabled)
                .map(([feature]) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {formatId(feature)}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
          <span className="text-2xl font-bold text-blue-600">
            {overallProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          {progress.completedSteps.length} of {totalSteps} steps completed
        </div>
      </div>

      {/* Assembly Phases */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <PhaseSection key={phase.id} phase={phase} progress={progress} />
        ))}
      </div>

      {/* Footer Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Tips for Success</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>✓ Read each step completely before starting</li>
          <li>✓ Take breaks every 45-60 minutes</li>
          <li>✓ Take photos at each major step for documentation</li>
          <li>✓ Test thoroughly before final case assembly</li>
          <li>✓ Ask for help in keyboard building communities if stuck</li>
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
