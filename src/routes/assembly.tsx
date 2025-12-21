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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Build Plan First
          </h1>
          <p className="text-gray-600 mb-6">
            Before accessing the assembly guide, you need to complete your keyboard build plan.
            This ensures you get personalized instructions for your specific configuration.
          </p>
          <Link
            to="/builder"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Go to Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AssemblyGuide />
    </div>
  );
}
