import { createFileRoute, Link } from '@tanstack/react-router';
import { Keyboard, Wrench, BookOpen, ArrowRight, Terminal, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Hero with technical header */}
        <div className="mb-20">
          <div
            className="inline-block px-4 py-2 mb-8 animate-slide-up"
            style={{
              border: '3px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              fontWeight: 600
            }}
          >
            <Terminal size={16} className="inline mr-2" style={{ transform: 'translateY(-1px)' }} />
            INTERACTIVE BUILD SYSTEM v1.0
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up"
            style={{
              fontFamily: 'var(--font-display)',
              animationDelay: '0.1s',
              opacity: 0
            }}
          >
            BUILD YOUR<br />
            <span style={{ color: 'var(--color-accent-orange)' }}>SPLIT KEYBOARD_</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-12 max-w-2xl animate-slide-up"
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: '1.7',
              animationDelay: '0.2s',
              opacity: 0
            }}
          >
            An interactive guide to help you learn, choose components, and build
            your custom split keyboard with confidence. Technical specifications,
            real-time cost tracking, and detailed assembly instructions.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-slide-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <Link to="/builder" className="key-button key-button-primary inline-flex items-center justify-center gap-2 text-base">
              Start Building
              <ArrowRight size={18} />
            </Link>
            <Link to="/components" className="key-button inline-flex items-center justify-center gap-2 text-base">
              Browse Components
              <BookOpen size={18} />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 stagger-children">
          <div className="tech-card group">
            <div
              className="flex items-center justify-center w-14 h-14 mb-6"
              style={{
                border: '3px solid var(--color-border)',
                background: 'var(--color-accent-orange)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Keyboard style={{ color: 'white' }} size={28} />
            </div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
            >
              INTERACTIVE_TREE
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Make informed choices with consequence previews showing cost, complexity,
              and compatibility before you commit.
            </p>
          </div>

          <div className="tech-card group">
            <div
              className="flex items-center justify-center w-14 h-14 mb-6"
              style={{
                border: '3px solid var(--color-border)',
                background: 'var(--color-accent-teal)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Wrench style={{ color: 'white' }} size={28} />
            </div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
            >
              COST_TRACKING
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              See your total build cost, complexity score, and estimated build time
              update as you make decisions.
            </p>
          </div>

          <div className="tech-card group">
            <div
              className="flex items-center justify-center w-14 h-14 mb-6"
              style={{
                border: '3px solid var(--color-border)',
                background: 'var(--color-text-primary)',
                transition: 'transform 0.2s ease'
              }}
            >
              <BookOpen style={{ color: 'white' }} size={28} />
            </div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
            >
              COMPONENT_DB
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Browse and learn about controllers, switches, features, and more
              with detailed specs and compatibility info.
            </p>
          </div>
        </div>

        {/* Why Split Keyboards - Technical Grid */}
        <div
          className="relative p-8 md:p-12"
          style={{
            border: '3px solid var(--color-border)',
            background: 'var(--color-bg-secondary)'
          }}
        >
          {/* Corner accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24"
            style={{
              background: 'var(--color-accent-orange)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              opacity: 0.1
            }}
          />

          <div className="flex items-center gap-3 mb-8">
            <Zap size={28} style={{ color: 'var(--color-accent-orange)' }} />
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
            >
              WHY_BUILD_SPLIT?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="p-6"
              style={{
                borderLeft: '3px solid var(--color-accent-orange)'
              }}
            >
              <h3
                className="font-bold mb-3 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                [01] ERGONOMICS
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Split keyboards allow for a more natural shoulder width positioning
                and can reduce strain during long typing sessions.
              </p>
            </div>

            <div
              className="p-6"
              style={{
                borderLeft: '3px solid var(--color-accent-teal)'
              }}
            >
              <h3
                className="font-bold mb-3 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                [02] CUSTOMIZATION
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Build exactly what you want - from layout and switches to features
                like trackballs, encoders, and RGB lighting.
              </p>
            </div>

            <div
              className="p-6"
              style={{
                borderLeft: '3px solid var(--color-accent-orange)'
              }}
            >
              <h3
                className="font-bold mb-3 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                [03] LEARNING
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Gain hands-on experience with electronics, soldering, firmware
                programming, and mechanical design.
              </p>
            </div>

            <div
              className="p-6"
              style={{
                borderLeft: '3px solid var(--color-accent-teal)'
              }}
            >
              <h3
                className="font-bold mb-3 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                [04] COMMUNITY
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
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
