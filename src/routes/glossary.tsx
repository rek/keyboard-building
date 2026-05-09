import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import glossaryData from '../data/glossary.json'

interface GlossarySearch {
  q?: string
}

export const Route = createFileRoute('/glossary')({
  component: GlossaryPage,
  validateSearch: (search: Record<string, unknown>): GlossarySearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
})

const GLOSSARY_TERMS: { term: string; definition: string }[] = glossaryData

function GlossaryPage() {
  const { q } = Route.useSearch()
  const [search, setSearch] = useState(q ?? '')

  const filtered = GLOSSARY_TERMS.filter(
    ({ term, definition }) =>
      term.toLowerCase().includes(search.toLowerCase()) ||
      definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          GLOSSARY
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Key terms and concepts for split keyboard building.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border-2 text-sm font-mono"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            outline: 'none',
          }}
        />
      </div>

      {/* Terms */}
      <div className="space-y-1">
        {filtered.map(({ term, definition }) => (
          <div
            key={term}
            className="glass-panel-light p-4 border-2"
            style={{
              borderColor: 'var(--color-border-light)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <dt
              className="font-bold text-sm mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent-teal)',
              }}
            >
              {term.toUpperCase()}
            </dt>
            <dd className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {definition}
            </dd>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
            No terms match your search.
          </p>
        )}
      </div>
    </main>
  )
}
