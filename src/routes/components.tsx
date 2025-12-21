import { createFileRoute } from '@tanstack/react-router';
import { ComponentGrid } from '../components/keyboard/ComponentGrid';

export const Route = createFileRoute('/components')({
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ComponentGrid />
      </div>
    </div>
  );
}
