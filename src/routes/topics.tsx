import { createFileRoute, Link } from '@tanstack/react-router'
import { getTopics } from '../utils/contentIndex'

export const Route = createFileRoute('/topics')({
  component: TopicsIndex,
})

function TopicsIndex() {
  const topics = getTopics()
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          TOPICS
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Reference pages that pull together steps, parts, and terms for a single subject. Use these
          when you want to look something up directly without going through the builder.
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            to="/topics/$slug"
            params={{ slug: topic.slug }}
            className="block p-4 border-2 transition-colors hover:opacity-90"
            style={{
              borderColor: 'var(--color-border-light)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <h2
              className="text-lg font-bold tracking-wide mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-orange)',
              }}
            >
              {topic.title.toUpperCase()}
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {topic.summary}
            </p>
            <div className="flex flex-wrap gap-1">
              {topic.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] tracking-widest px-2 py-0.5"
                  style={{
                    border: '1px solid var(--color-border-light)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
