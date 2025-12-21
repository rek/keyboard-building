import { createFileRoute } from '@tanstack/react-router';
import { DecisionTree } from '../components/keyboard/DecisionTree';
import { CostEstimator } from '../components/keyboard/CostEstimator';

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
});

function BuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interactive Keyboard Builder
          </h1>
          <p className="text-gray-600">
            Make your choices step by step. Preview the impact of each decision before committing.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Decision Tree - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <DecisionTree />
          </div>

          {/* Cost Estimator Sidebar - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <CostEstimator />
          </div>
        </div>
      </div>
    </div>
  );
}
