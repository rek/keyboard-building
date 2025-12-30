import { createFileRoute } from '@tanstack/react-router';
import { ComponentGrid } from '../components/keyboard/ComponentGrid';

export const Route = createFileRoute('/components')({
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <div className="min-h-screen relative z-10" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
          >
            COMPONENT_DATABASE
          </h1>
          <p
            className="text-base md:text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Browse and learn about controllers, switches, features, and more with detailed specifications.
          </p>
        </div>
        <ComponentGrid />
      </div>
    </div>
  );
}
