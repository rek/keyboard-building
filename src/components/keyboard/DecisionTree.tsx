import React, { useState } from 'react';
import { useUserChoices } from '../../contexts/UserChoicesContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { ConsequencePreview, ConsequencePreviewData } from './ConsequencePreview';
import { checkCompatibility } from '../../utils/compatibilityChecker';
import decisionTreeData from '../../data/decision-trees.json';

interface DecisionStep {
  id: string;
  title: string;
  description: string;
  order: number;
  options: Array<{
    id: string;
    name: string;
    shortDesc: string;
    image: string;
    costDelta: number;
    complexityDelta: number;
    timeHours: number;
    skillLevel: string;
    requiredTools: string[];
    downstreamEffects: string[];
  }>;
}

export function DecisionTree() {
  const { choices, updateChoice } = useUserChoices();
  const { formatCurrency } = useCurrency();
  const { settings } = useAppSettings();
  const [previewData, setPreviewData] = useState<ConsequencePreviewData | null>(null);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  const steps: DecisionStep[] = decisionTreeData.steps;

  const handlePreview = (decision: DecisionStep, option: DecisionStep['options'][0]) => {
    // Create a temporary choices object with this option selected
    const tempChoices = { ...choices };

    // Map decision ID to choices property
    if (decision.id === 'buildMethod') {
      tempChoices.buildMethod = option.id;
    } else if (decision.id === 'layout') {
      tempChoices.layout = { ...tempChoices.layout, formFactor: option.id };
    } else if (decision.id === 'controller') {
      tempChoices.controller = option.id;
    } else if (decision.id === 'switches') {
      tempChoices.switchType = option.id;
    } else if (decision.id === 'connectivity') {
      tempChoices.connectivity = option.id;
    } else if (decision.id === 'firmware') {
      tempChoices.firmware = option.id;
    }

    // Check compatibility with temporary choices
    const warnings = checkCompatibility(tempChoices);

    setPreviewData({
      decision: decision.title,
      option,
      warnings,
    });
    setSelectedDecisionId(decision.id);
  };

  const handleConfirm = () => {
    if (!previewData || !selectedDecisionId) return;

    const optionId = previewData.option.id;

    // Update the appropriate choice
    if (selectedDecisionId === 'buildMethod') {
      updateChoice('buildMethod', optionId);
    } else if (selectedDecisionId === 'layout') {
      updateChoice('layout', { ...choices.layout, formFactor: optionId });
    } else if (selectedDecisionId === 'controller') {
      updateChoice('controller', optionId);
    } else if (selectedDecisionId === 'switches') {
      updateChoice('switchType', optionId);
    } else if (selectedDecisionId === 'connectivity') {
      updateChoice('connectivity', optionId);
    } else if (selectedDecisionId === 'firmware') {
      updateChoice('firmware', optionId);
    }

    setPreviewData(null);
    setSelectedDecisionId(null);
  };

  const handleClosePreview = () => {
    setPreviewData(null);
    setSelectedDecisionId(null);
  };

  const getCurrentValue = (decisionId: string): string | null => {
    if (decisionId === 'buildMethod') return choices.buildMethod;
    if (decisionId === 'layout') return choices.layout.formFactor;
    if (decisionId === 'controller') return choices.controller;
    if (decisionId === 'switches') return choices.switchType;
    if (decisionId === 'connectivity') return choices.connectivity;
    if (decisionId === 'firmware') return choices.firmware;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-12">
        {steps.map((decision, stepIndex) => {
          const currentValue = getCurrentValue(decision.id);
          const isCompleted = currentValue !== null;

          return (
            <div
              key={decision.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {/* Step Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : stepIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {decision.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{decision.description}</p>
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {decision.options.map((option) => {
                  const isSelected = currentValue === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePreview(decision, option)}
                      className={`relative text-left p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}

                      {/* Option Image */}
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {option.image ? (
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">Image</span>
                        )}
                      </div>

                      {/* Option Title */}
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-gray-600 mb-3">
                        {option.shortDesc}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between text-sm">
                        {settings.showPricing && (
                          <span className="text-blue-600 font-medium">
                            +{formatCurrency(option.costDelta)}
                          </span>
                        )}
                        <div className={`flex items-center gap-1 ${!settings.showPricing ? 'ml-auto' : ''}`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < option.complexityDelta
                                  ? 'bg-orange-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Skill Level Badge */}
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {option.skillLevel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Consequence Preview Modal */}
      <ConsequencePreview
        data={previewData}
        onClose={handleClosePreview}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
