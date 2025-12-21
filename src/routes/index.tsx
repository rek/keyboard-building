import { createFileRoute, Link } from '@tanstack/react-router';
import { Keyboard, Wrench, BookOpen, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your Perfect
            <span className="block text-blue-600">Split Keyboard</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An interactive guide to help you learn, choose components, and build
            your custom split keyboard with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Start Building
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/components"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Browse Components
              <BookOpen size={20} />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Keyboard className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Interactive Decision Tree
            </h3>
            <p className="text-gray-600">
              Make informed choices with consequence previews showing cost, complexity,
              and compatibility before you commit.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Real-Time Cost Tracking
            </h3>
            <p className="text-gray-600">
              See your total build cost, complexity score, and estimated build time
              update as you make decisions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Component Encyclopedia
            </h3>
            <p className="text-gray-600">
              Browse and learn about controllers, switches, features, and more
              with detailed specs and compatibility info.
            </p>
          </div>
        </div>

        {/* Why Split Keyboards */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Build a Split Keyboard?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ergonomics</h3>
              <p className="text-gray-600">
                Split keyboards allow for a more natural shoulder width positioning
                and can reduce strain during long typing sessions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customization</h3>
              <p className="text-gray-600">
                Build exactly what you want - from layout and switches to features
                like trackballs, encoders, and RGB lighting.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Learning Experience</h3>
              <p className="text-gray-600">
                Gain hands-on experience with electronics, soldering, firmware
                programming, and mechanical design.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join a passionate community of keyboard enthusiasts sharing designs,
                tips, and innovations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
