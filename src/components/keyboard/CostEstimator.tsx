import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useCostEstimate } from '../../hooks/useCostEstimate';
import { useUserChoices } from '../../contexts/UserChoicesContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';
import { checkCompatibility, getCompatibilityStatus } from '../../utils/compatibilityChecker';
import { exportAsJSON, exportAsText } from '../../utils/exportBuildPlan';

export function CostEstimator() {
  const { breakdown, total, complexity, buildTimeHours } = useCostEstimate();
  const { choices, isComplete } = useUserChoices();
  const { formatCurrency, currency } = useCurrency();
  const { settings } = useAppSettings();
  const warnings = checkCompatibility(choices);
  const compatibilityStatus = getCompatibilityStatus(warnings);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportJSON = () => {
    exportAsJSON(choices, breakdown, total, complexity, buildTimeHours, currency);
    setShowExportMenu(false);
  };

  const handleExportText = () => {
    exportAsText(choices, breakdown, total, complexity, buildTimeHours, currency, formatCurrency);
    setShowExportMenu(false);
  };

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
  ].filter((item) => item.amount > 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {settings.showPricing ? 'Build Estimate' : 'Build Summary'}
      </h2>

      {/* Total Cost */}
      {settings.showPricing && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="text-sm font-medium mb-1">Total Estimated Cost</div>
          <div className="text-3xl font-bold">{formatCurrency(total)}</div>
        </div>
      )}

      {/* Compatibility Status */}
      {warnings.length > 0 && (
        <div className="mb-6">
          <div
            className={`p-3 rounded-lg ${
              compatibilityStatus === 'errors'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {compatibilityStatus === 'errors' ? '⛔' : '⚠️'}
              </span>
              <span
                className={`font-semibold ${
                  compatibilityStatus === 'errors' ? 'text-red-800' : 'text-yellow-800'
                }`}
              >
                {warnings.length} Compatibility {warnings.length === 1 ? 'Issue' : 'Issues'}
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Complexity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Build Complexity</span>
          <span className="text-sm font-bold text-gray-900">{complexity}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              complexity <= 3
                ? 'bg-green-500'
                : complexity <= 6
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${complexity * 10}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {complexity <= 3
            ? 'Beginner Friendly'
            : complexity <= 6
            ? 'Intermediate'
            : 'Advanced'}
        </div>
      </div>

      {/* Build Time */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Estimated Build Time</div>
        <div className="text-2xl font-bold text-purple-600">{buildTimeHours}h</div>
        <div className="text-xs text-gray-500 mt-1">
          {buildTimeHours < 5
            ? 'Quick build'
            : buildTimeHours < 20
            ? 'Weekend project'
            : 'Multi-week project'}
        </div>
      </div>

      {/* Cost Breakdown */}
      {settings.showPricing && breakdownItems.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
          <div className="space-y-2">
            {breakdownItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          Export Build Plan
          <span className="text-xs">▼</span>
        </button>

        {showExportMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowExportMenu(false)}
            />
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="font-medium text-gray-900">Export as JSON</div>
                <div className="text-xs text-gray-500">Machine-readable format</div>
              </button>
              <button
                onClick={handleExportText}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Export as Text</div>
                <div className="text-xs text-gray-500">Human-readable checklist</div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Assembly Guide Button */}
      {isComplete && (
        <Link
          to="/assembly"
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 mt-3"
        >
          <span>📖</span>
          View Assembly Guide
          <span>→</span>
        </Link>
      )}
    </div>
  );
}
