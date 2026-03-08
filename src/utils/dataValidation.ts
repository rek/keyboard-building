/**
 * Runtime validation helpers for JSON data imports.
 * Validates the shape of data files at module load time to catch
 * corrupt or malformed data early.
 */

type ValidationResult = { valid: true } | { valid: false; error: string }

function validate(condition: boolean, message: string): ValidationResult {
  return condition ? { valid: true } : { valid: false, error: message }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

// ─── Component entry validator ────────────────────────────────────────────────

export interface ComponentEntry {
  id: string
  name: string
  price: number
  complexity: number
  pros: string[]
  cons: string[]
  compatibleWith: string[]
  incompatibleWith: string[]
}

export function validateComponentEntry(entry: unknown, context: string): ValidationResult {
  if (!isRecord(entry)) return validate(false, `${context}: not an object`)
  if (typeof entry.id !== 'string') return validate(false, `${context}: id must be a string`)
  if (typeof entry.name !== 'string') return validate(false, `${context}: name must be a string`)
  if (typeof entry.price !== 'number') return validate(false, `${context}: price must be a number`)
  if (typeof entry.complexity !== 'number')
    return validate(false, `${context}: complexity must be a number`)
  if (!isStringArray(entry.pros)) return validate(false, `${context}: pros must be string[]`)
  if (!isStringArray(entry.cons)) return validate(false, `${context}: cons must be string[]`)
  if (!isStringArray(entry.compatibleWith))
    return validate(false, `${context}: compatibleWith must be string[]`)
  if (!isStringArray(entry.incompatibleWith))
    return validate(false, `${context}: incompatibleWith must be string[]`)
  return { valid: true }
}

export function validateComponentsData(
  data: unknown,
  requiredCategories: string[] = []
): ValidationResult {
  if (!isRecord(data)) return validate(false, 'components.json: root must be an object')

  for (const category of requiredCategories) {
    if (!(category in data))
      return validate(false, `components.json: missing required category "${category}"`)
    if (!isRecord(data[category]))
      return validate(false, `components.json: category "${category}" must be an object`)

    for (const [id, entry] of Object.entries(data[category])) {
      const result = validateComponentEntry(entry, `${category}.${id}`)
      if (!result.valid) return result
    }
  }

  return { valid: true }
}

// ─── Cost database validator ──────────────────────────────────────────────────

export function validateCostDatabase(data: unknown): ValidationResult {
  if (!isRecord(data)) return validate(false, 'cost-database.json: root must be an object')

  const requiredKeys = [
    'controllers',
    'switches',
    'keycaps',
    'features',
    'connectivity',
    'shipping',
    'buildMethodExtras',
    'tools',
  ]

  for (const key of requiredKeys) {
    if (!(key in data))
      return validate(false, `cost-database.json: missing required key "${key}"`)
    if (!isRecord(data[key]))
      return validate(false, `cost-database.json: "${key}" must be an object`)
  }

  return { valid: true }
}

// ─── Decision tree validator ──────────────────────────────────────────────────

export function validateDecisionTreeData(data: unknown): ValidationResult {
  if (!isRecord(data)) return validate(false, 'decision-trees.json: root must be an object')
  if (!Array.isArray(data.steps))
    return validate(false, 'decision-trees.json: "steps" must be an array')

  for (const [i, step] of (data.steps as unknown[]).entries()) {
    if (!isRecord(step)) return validate(false, `decision-trees.json: step[${i}] must be an object`)
    if (typeof step.id !== 'string')
      return validate(false, `decision-trees.json: step[${i}].id must be a string`)
    if (!Array.isArray(step.options))
      return validate(false, `decision-trees.json: step[${i}].options must be an array`)
  }

  return { valid: true }
}

// ─── Assembly data validator ──────────────────────────────────────────────────

export function validateAssemblyData(data: unknown): ValidationResult {
  if (!isRecord(data)) return validate(false, 'assembly-steps.json: root must be an object')
  if (!Array.isArray(data.phases))
    return validate(false, 'assembly-steps.json: "phases" must be an array')

  for (const [i, phase] of (data.phases as unknown[]).entries()) {
    if (!isRecord(phase))
      return validate(false, `assembly-steps.json: phase[${i}] must be an object`)
    if (typeof phase.id !== 'string')
      return validate(false, `assembly-steps.json: phase[${i}].id must be a string`)
    if (!Array.isArray(phase.steps))
      return validate(false, `assembly-steps.json: phase[${i}].steps must be an array`)
  }

  return { valid: true }
}

// ─── Warn-only wrapper (non-fatal in production) ──────────────────────────────

export function warnIfInvalid(result: ValidationResult, source: string): void {
  if (!result.valid) {
    console.warn(`[data validation] ${source}: ${result.error}`)
  }
}
