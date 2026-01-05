import { createFileRoute } from '@tanstack/react-router'
import { DecisionTree } from '../components/keyboard/DecisionTree'
import { CostEstimator } from '../components/keyboard/CostEstimator'

export const Route = createFileRoute('/builder')({
  component: BuilderPage,
})

function BuilderPage() {
  return (
    <div className="min-h-screen relative z-10" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
          >
            INTERACTIVE_BUILDER
          </h1>
          <p className="text-base md:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Make your choices step by step. Preview the impact of each decision before committing.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  )
}
