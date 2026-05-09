import { useState, useRef, useEffect, useMemo, useId } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { searchIndex, type IndexedRecord, type IndexedRecordType } from '../utils/contentIndex'

const TYPE_LABEL: Record<IndexedRecordType, string> = {
  assembly: 'STEP',
  component: 'PART',
  glossary: 'TERM',
  topic: 'TOPIC',
}

const TYPE_COLOR: Record<IndexedRecordType, string> = {
  assembly: 'var(--color-accent-orange)',
  component: 'var(--color-accent-teal)',
  glossary: 'var(--color-text-secondary)',
  topic: 'var(--color-accent-orange)',
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const listboxId = useId()
  const optionId = (i: number) => `${listboxId}-opt-${i}`

  const results = useMemo<IndexedRecord[]>(() => searchIndex(query, 12), [query])

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onClickAway = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [open])

  const go = (record: IndexedRecord) => {
    setOpen(false)
    setQuery('')
    void navigate({ to: record.href })
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      const target = results[activeIdx]
      if (target) go(target)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xs">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--color-text-secondary)' }}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search steps, parts, topics…"
          className="w-full pl-7 pr-2 py-1.5 text-xs border-2"
          style={{
            borderColor: 'var(--color-border-light)',
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
          aria-label="Search guide"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open && results.length > 0}
          aria-activedescendant={open && results.length > 0 ? optionId(activeIdx) : undefined}
          role="combobox"
        />
      </div>

      {open && query && (
        <div
          id={listboxId}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-border)',
            boxShadow: '4px 4px 0 0 var(--color-border)',
          }}
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="p-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              No matches.
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.type}-${r.id}`}
                id={optionId(i)}
                onClick={() => go(r)}
                onMouseEnter={() => setActiveIdx(i)}
                className="w-full text-left p-2 transition-colors block"
                style={{
                  background: i === activeIdx ? 'var(--color-bg-primary)' : 'transparent',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
                role="option"
                aria-selected={i === activeIdx}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[9px] font-bold tracking-widest px-1.5 py-0.5"
                    style={{
                      background: TYPE_COLOR[r.type],
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {TYPE_LABEL[r.type]}
                  </span>
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {r.title}
                  </span>
                </div>
                <div
                  className="text-[10px] truncate pl-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {r.body.slice(0, 120)}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
