import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getTopicBySlug, getAssemblyStepById, getGlossaryTerm } from '../utils/contentIndex'

export const Route = createFileRoute('/topics/$slug')({
  component: TopicDetail,
  loader: ({ params }) => {
    const topic = getTopicBySlug(params.slug)
    if (!topic) {
      // notFound() returns a NotFoundError sentinel that TanStack Router throws to render the 404 boundary
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound()
    }
    return { topic }
  },
})

function TopicDetail() {
  const { topic } = Route.useLoaderData()

  const steps = topic.stepIds
    .map((id) => getAssemblyStepById(id))
    .filter((s): s is NonNullable<ReturnType<typeof getAssemblyStepById>> => s !== undefined)
  const missingStepIds = topic.stepIds.filter((id) => !getAssemblyStepById(id))

  const terms = topic.glossaryTerms
    .map((t) => getGlossaryTerm(t))
    .filter((g): g is NonNullable<ReturnType<typeof getGlossaryTerm>> => g !== undefined)

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        <Link to="/topics" style={{ color: 'var(--color-accent-orange)' }}>
          ← All topics
        </Link>
      </div>
      <h1
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        {topic.title.toUpperCase()}
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        {topic.summary}
      </p>

      {steps.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-teal)' }}
          >
            STEPS
          </h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <article
                key={s.id}
                className="p-4 border-2"
                style={{
                  borderColor: 'var(--color-border-light)',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {s.title}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {s.description}
                </p>
                <pre
                  className="text-xs whitespace-pre-wrap"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s.content}
                </pre>
              </article>
            ))}
          </div>
        </section>
      )}

      {missingStepIds.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}
          >
            PLANNED STEPS — content TBD
          </h2>
          <ul
            className="text-xs list-disc pl-6"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            {missingStepIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </section>
      )}

      {terms.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-sm font-bold tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-teal)' }}
          >
            RELATED TERMS
          </h2>
          <dl className="space-y-2">
            {terms.map(({ term, definition }) => (
              <div
                key={term}
                className="p-3 border-2"
                style={{
                  borderColor: 'var(--color-border-light)',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                <dt
                  className="font-bold text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-accent-orange)',
                  }}
                >
                  {term.toUpperCase()}
                </dt>
                <dd className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </main>
  )
}
