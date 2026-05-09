import assemblyData from '../data/assembly-steps.json'
import componentsData from '../data/components.json'
import glossaryData from '../data/glossary.json'
import topicsData from '../data/topics.json'
import type { AssemblyData, AssemblyStep } from '../types/assembly'

export type IndexedRecordType = 'assembly' | 'component' | 'glossary' | 'topic'

export interface IndexedRecord {
  type: IndexedRecordType
  id: string
  title: string
  body: string
  tags: string[]
  href: string
  // Lowercased searchable haystack — title + body + tags
  _haystack: string
}

export interface Topic {
  slug: string
  title: string
  summary: string
  tags: string[]
  stepIds: string[]
  componentIds: string[]
  glossaryTerms: string[]
}

const assembly = assemblyData as AssemblyData
const glossary = glossaryData as { term: string; definition: string }[]
const topics = topicsData as Topic[]

function makeRecord(
  type: IndexedRecordType,
  id: string,
  title: string,
  body: string,
  tags: string[],
  href: string
): IndexedRecord {
  return {
    type,
    id,
    title,
    body,
    tags,
    href,
    _haystack: `${title}\n${body}\n${tags.join(' ')}`.toLowerCase(),
  }
}

let cached: IndexedRecord[] | null = null

export function getContentIndex(): IndexedRecord[] {
  if (cached) return cached

  const records: IndexedRecord[] = []

  // Assembly steps — link to /assembly (deep-link by step id is a follow-up)
  for (const phase of assembly.phases) {
    for (const step of phase.steps) {
      records.push(
        makeRecord(
          'assembly',
          step.id,
          step.title,
          `${step.description}\n${step.content}`,
          [phase.id, phase.title],
          '/assembly'
        )
      )
    }
  }

  // Components — components.json is { category: { id: entry } }
  const cdata = componentsData as Record<string, Record<string, unknown> | undefined>
  for (const [category, entries] of Object.entries(cdata)) {
    if (!entries || typeof entries !== 'object') continue
    for (const [id, raw] of Object.entries(entries)) {
      if (!raw || typeof raw !== 'object') continue
      const entry = raw as Record<string, unknown>
      const name = typeof entry.name === 'string' ? entry.name : id
      const pros = Array.isArray(entry.pros) ? (entry.pros as string[]) : []
      const cons = Array.isArray(entry.cons) ? (entry.cons as string[]) : []
      const body = [name, ...pros, ...cons].join(' ')
      records.push(makeRecord('component', id, name, body, [category], '/components'))
    }
  }

  // Glossary
  for (const { term, definition } of glossary) {
    records.push(
      makeRecord(
        'glossary',
        term,
        term,
        definition,
        ['glossary'],
        `/glossary?q=${encodeURIComponent(term)}`
      )
    )
  }

  // Topics
  for (const topic of topics) {
    records.push(
      makeRecord(
        'topic',
        topic.slug,
        topic.title,
        topic.summary,
        topic.tags,
        `/topics/${topic.slug}`
      )
    )
  }

  cached = records
  return records
}

export function getTopics(): Topic[] {
  return topics
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}

export function getAssemblyStepById(id: string): AssemblyStep | undefined {
  for (const phase of assembly.phases) {
    for (const step of phase.steps) {
      if (step.id === id) return step
    }
  }
  return undefined
}

export function getGlossaryTerm(term: string): { term: string; definition: string } | undefined {
  return glossary.find((g) => g.term === term)
}

export function searchIndex(query: string, limit = 20): IndexedRecord[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)

  interface Scored {
    record: IndexedRecord
    score: number
  }
  const scored: Scored[] = []

  for (const record of getContentIndex()) {
    let score = 0
    let matchedAll = true
    for (const tok of tokens) {
      if (!record._haystack.includes(tok)) {
        matchedAll = false
        break
      }
      // Title hits weighted higher
      if (record.title.toLowerCase().includes(tok)) score += 5
      else score += 1
    }
    if (matchedAll) scored.push({ record, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.record)
}
