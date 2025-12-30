import { createFileRoute, Link } from '@tanstack/react-router';
import { useUserChoices } from '../contexts/UserChoicesContext';
import { AssemblyGuide } from '../components/assembly/AssemblyGuide';

export const Route = createFileRoute('/assembly')({
  component: AssemblyPage,
});

function AssemblyPage() {
  const { isComplete } = useUserChoices();

  // If build plan is not complete, show a message prompting user to finish
  if (!isComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--color-bg-primary)' }}
      >
        <div
          className="max-w-md w-full p-8 text-center"
          style={{
            border: '3px solid var(--color-border)',
            background: 'var(--color-bg-secondary)'
          }}
        >
          <div className="text-6xl mb-6">🔧</div>
          <h1
            className="text-2xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
              color: 'var(--color-text-primary)'
            }}
          >
            [BUILD_PLAN_INCOMPLETE]
          </h1>
          <p
            className="mb-6 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Before accessing the assembly guide, you need to complete your keyboard build plan.
            This ensures you get personalized instructions for your specific configuration.
          </p>
          <Link
            to="/builder"
            className="inline-block px-6 py-3 border-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] font-bold text-sm tracking-wide"
            style={{
              borderColor: 'var(--color-accent-orange)',
              background: 'var(--color-accent-orange)',
              color: 'white',
              fontFamily: 'var(--font-display)'
            }}
          >
            GO_TO_BUILDER →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <AssemblyGuide />
    </div>
  );
}
