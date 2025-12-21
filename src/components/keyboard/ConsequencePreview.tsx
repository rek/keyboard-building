import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';

export interface ConsequencePreviewData {
  decision: string;
  option: {
    id: string;
    name: string;
    shortDesc: string;
    costDelta: number;
    complexityDelta: number;
    timeHours: number;
    skillLevel: string;
    requiredTools: string[];
    downstreamEffects: string[];
  };
  warnings: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>;
}

interface ConsequencePreviewProps {
  data: ConsequencePreviewData | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConsequencePreview({ data, onClose, onConfirm }: ConsequencePreviewProps) {
  if (!data) return null;

  const { option, warnings } = data;
  const { formatCurrency } = useCurrency();
  const { settings } = useAppSettings();

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{option.name}</h2>
              <p className="text-gray-600 mt-1">{option.shortDesc}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Quick Stats */}
          <div className={`grid ${settings.showPricing ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6 p-4 bg-gray-50 rounded-lg`}>
            {settings.showPricing && (
              <div>
                <div className="text-sm text-gray-600">Cost Impact</div>
                <div className="text-xl font-bold text-blue-600">
                  +{formatCurrency(option.costDelta)}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Build Time</div>
              <div className="text-xl font-bold text-purple-600">
                {option.timeHours}h
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Complexity</div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < option.complexityDelta
                        ? 'bg-orange-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Skill Level Required</h3>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {option.skillLevel}
            </div>
          </div>

          {/* Required Tools */}
          {option.requiredTools.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">You Will Need:</h3>
              <ul className="space-y-2">
                {option.requiredTools.map((tool, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Downstream Effects */}
          {option.downstreamEffects.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">This Will Affect:</h3>
              <ul className="space-y-2">
                {option.downstreamEffects.map((effect, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">→</span>
                    <span className="text-gray-700">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Compatibility Warnings:</h3>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      warning.severity === 'error'
                        ? 'bg-red-50 border-red-500'
                        : warning.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {warning.severity === 'error'
                          ? '⛔'
                          : warning.severity === 'warning'
                          ? '⚠️'
                          : 'ℹ️'}
                      </span>
                      <p
                        className={`text-sm ${
                          warning.severity === 'error'
                            ? 'text-red-800'
                            : warning.severity === 'warning'
                            ? 'text-yellow-800'
                            : 'text-blue-800'
                        }`}
                      >
                        {warning.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={warnings.some((w) => w.severity === 'error')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {warnings.some((w) => w.severity === 'error')
                ? 'Incompatible'
                : 'Choose This Option'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
