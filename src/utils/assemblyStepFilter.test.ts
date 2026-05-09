import { describe, it, expect } from 'vitest'
import { getRelevantSteps, getBuildHash, getTotalSteps } from './assemblyStepFilter'
import type { UserChoices } from '../contexts/UserChoicesContext'
import type { AssemblyPhase, AssemblyStep } from '../types/assembly'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const base: UserChoices = {
  buildMethod: 'handwired',
  layout: { formFactor: 'standard-split', keyCount: 60 },
  controller: 'pro-micro',
  switchType: 'mx',
  features: {
    hotswap: false,
    rgb: false,
    oled: false,
    encoder: false,
    trackball: false,
    wireless: false,
  },
  connectivity: 'trrs',
  firmware: 'qmk',
}

function makeStep(overrides: Partial<AssemblyStep> = {}): AssemblyStep {
  return {
    id: 'step-1',
    title: 'Test Step',
    description: 'A test step',
    order: 1,
    content: 'Step content',
    requirements: {},
    ...overrides,
  }
}

function makePhase(steps: AssemblyStep[], id = 'phase-1'): AssemblyPhase {
  return {
    id,
    title: 'Test Phase',
    order: 1,
    description: 'A test phase',
    icon: '🔧',
    estimatedTime: '1h',
    steps,
  }
}

// ---------------------------------------------------------------------------
// getRelevantSteps
// ---------------------------------------------------------------------------

describe('getRelevantSteps', () => {
  it('returns all steps when none have requirements', () => {
    const phases = [makePhase([makeStep(), makeStep({ id: 'step-2' })])]
    const result = getRelevantSteps(base, phases)
    expect(result[0].steps).toHaveLength(2)
  })

  it('removes steps that do not match the current buildMethod', () => {
    const steps = [
      makeStep({ id: 'handwired-step', requirements: { buildMethod: ['handwired'] } }),
      makeStep({ id: 'pcb-step', requirements: { buildMethod: ['custom-pcb'] } }),
    ]
    const result = getRelevantSteps(base, [makePhase(steps)])
    expect(result[0].steps).toHaveLength(1)
    expect(result[0].steps[0].id).toBe('handwired-step')
  })

  it('removes phases that become empty after filtering', () => {
    const pcbOnlyStep = makeStep({ requirements: { buildMethod: ['custom-pcb'] } })
    const phases = [makePhase([pcbOnlyStep], 'empty-phase'), makePhase([makeStep()], 'full-phase')]
    const result = getRelevantSteps(base, phases)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('full-phase')
  })

  it('returns empty array when all phases are filtered out', () => {
    const step = makeStep({ requirements: { buildMethod: ['custom-pcb'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// isStepRelevant (via getRelevantSteps)
// ---------------------------------------------------------------------------

describe('isStepRelevant', () => {
  it('shows step with no requirements regardless of choices', () => {
    const step = makeStep({ requirements: {} })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('shows step when buildMethod is in the allowed list', () => {
    const step = makeStep({ requirements: { buildMethod: ['handwired', 'custom-pcb'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when buildMethod is not in the allowed list', () => {
    const step = makeStep({ requirements: { buildMethod: ['custom-pcb'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('hides step when buildMethod is null (not yet chosen)', () => {
    const choices: UserChoices = { ...base, buildMethod: null }
    const step = makeStep({ requirements: { buildMethod: ['handwired'] } })
    const result = getRelevantSteps(choices, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when formFactor matches', () => {
    const step = makeStep({ requirements: { layout: { formFactor: ['standard-split'] } } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when formFactor does not match', () => {
    const step = makeStep({ requirements: { layout: { formFactor: ['ergonomic-3d'] } } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when controller matches', () => {
    const step = makeStep({ requirements: { controller: ['pro-micro', 'elite-c'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when controller does not match', () => {
    const step = makeStep({ requirements: { controller: ['nice-nano'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when firmware matches', () => {
    const step = makeStep({ requirements: { firmware: ['qmk', 'vial'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when firmware does not match', () => {
    const step = makeStep({ requirements: { firmware: ['zmk'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when connectivity matches', () => {
    const step = makeStep({ requirements: { connectivity: ['trrs'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when connectivity does not match', () => {
    const step = makeStep({ requirements: { connectivity: ['wireless'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when switchType matches', () => {
    const step = makeStep({ requirements: { switchType: ['mx'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when switchType does not match', () => {
    const step = makeStep({ requirements: { switchType: ['choc-v1'] } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when required feature is enabled', () => {
    const choices: UserChoices = { ...base, features: { ...base.features, rgb: true } }
    const step = makeStep({ requirements: { features: { rgb: true } } })
    const result = getRelevantSteps(choices, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when required feature is not enabled', () => {
    const step = makeStep({ requirements: { features: { rgb: true } } })
    // base has rgb: false
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('hides step when multiple required features are not all enabled', () => {
    const choices: UserChoices = { ...base, features: { ...base.features, rgb: true } }
    // Requires both rgb and oled; only rgb is enabled
    const step = makeStep({ requirements: { features: { rgb: true, oled: true } } })
    const result = getRelevantSteps(choices, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('hides step when feature requirement is false and feature is enabled', () => {
    // A requirement of { features: { hotswap: false } } means "only show if hotswap is NOT enabled".
    const choices: UserChoices = { ...base, features: { ...base.features, hotswap: true } }
    const step = makeStep({ requirements: { features: { hotswap: false } } })
    const result = getRelevantSteps(choices, [makePhase([step])])
    expect(result).toHaveLength(0)
  })

  it('shows step when feature requirement is false and feature is disabled', () => {
    // base.features.hotswap is false → requirement satisfied
    const step = makeStep({ requirements: { features: { hotswap: false } } })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('handles multiple requirements — all must pass', () => {
    const step = makeStep({
      requirements: {
        buildMethod: ['handwired'],
        firmware: ['qmk'],
        controller: ['pro-micro'],
      },
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps).toHaveLength(1)
  })

  it('hides step when only one of multiple requirements fails', () => {
    const step = makeStep({
      requirements: {
        buildMethod: ['handwired'],
        firmware: ['zmk'], // mismatch — base uses qmk
      },
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// applyStepVariations (via getRelevantSteps)
// ---------------------------------------------------------------------------

describe('applyStepVariations', () => {
  it('returns step unchanged when it has no variations', () => {
    const step = makeStep({ content: 'original', variations: [] })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toBe('original')
  })

  it('appends additionalContent when condition matches', () => {
    const step = makeStep({
      content: 'base content',
      variations: [
        {
          condition: { firmware: 'qmk' }, // base uses qmk
          additionalContent: 'qmk extra',
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toBe('base content\n\nqmk extra')
  })

  it('does not append content when condition does not match', () => {
    const step = makeStep({
      content: 'base content',
      variations: [
        {
          condition: { firmware: 'zmk' }, // base uses qmk, not zmk
          additionalContent: 'zmk extra',
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toBe('base content')
  })

  it('appends variation warnings to existing warnings', () => {
    const step = makeStep({
      warnings: ['existing warning'],
      variations: [
        {
          condition: { firmware: 'qmk' },
          warnings: ['qmk warning'],
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].warnings).toEqual(['existing warning', 'qmk warning'])
  })

  it('appends variation tips when condition matches', () => {
    const step = makeStep({
      variations: [
        {
          condition: { buildMethod: 'handwired' },
          tips: ['solder carefully'],
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].tips).toContain('solder carefully')
  })

  it('supports array condition values (matches any element)', () => {
    // condition value is array → actual value must be in that array
    const step = makeStep({
      content: 'base',
      variations: [
        {
          condition: { firmware: ['qmk', 'vial'] }, // base.firmware = 'qmk'
          additionalContent: 'wired firmware note',
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toContain('wired firmware note')
  })

  it('supports nested dot-notation paths in conditions', () => {
    const step = makeStep({
      content: 'base',
      variations: [
        {
          condition: { 'layout.formFactor': 'standard-split' },
          additionalContent: 'standard split note',
        },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toContain('standard split note')
  })

  it('applies multiple matching variations cumulatively', () => {
    const step = makeStep({
      content: 'base',
      variations: [
        { condition: { firmware: 'qmk' }, additionalContent: 'qmk note' },
        { condition: { buildMethod: 'handwired' }, additionalContent: 'handwired note' },
      ],
    })
    const result = getRelevantSteps(base, [makePhase([step])])
    expect(result[0].steps[0].content).toContain('qmk note')
    expect(result[0].steps[0].content).toContain('handwired note')
  })

  it('does not mutate the original step', () => {
    const step = makeStep({
      content: 'original',
      warnings: ['original warning'],
      variations: [
        { condition: { firmware: 'qmk' }, additionalContent: 'extra', warnings: ['new warning'] },
      ],
    })
    getRelevantSteps(base, [makePhase([step])])
    // Original step object should be untouched
    expect(step.content).toBe('original')
    expect(step.warnings).toEqual(['original warning'])
  })
})

// ---------------------------------------------------------------------------
// getBuildHash
// ---------------------------------------------------------------------------

describe('getBuildHash', () => {
  it('returns the same hash for identical choices', () => {
    expect(getBuildHash(base)).toBe(getBuildHash({ ...base }))
  })

  it('returns a different hash when buildMethod changes', () => {
    const a = getBuildHash(base)
    const b = getBuildHash({ ...base, buildMethod: 'custom-pcb' })
    expect(a).not.toBe(b)
  })

  it('returns a different hash when controller changes', () => {
    const a = getBuildHash(base)
    const b = getBuildHash({ ...base, controller: 'nice-nano' })
    expect(a).not.toBe(b)
  })

  it('returns a different hash when firmware changes', () => {
    const a = getBuildHash(base)
    const b = getBuildHash({ ...base, firmware: 'zmk' })
    expect(a).not.toBe(b)
  })

  it('returns a different hash when a feature toggles', () => {
    const a = getBuildHash(base)
    const b = getBuildHash({ ...base, features: { ...base.features, rgb: true } })
    expect(a).not.toBe(b)
  })

  it('returns a different hash when switchType changes', () => {
    const a = getBuildHash({ ...base, switchType: 'mx' })
    const b = getBuildHash({ ...base, switchType: 'choc-v1' })
    expect(a).not.toBe(b)
  })
})

// ---------------------------------------------------------------------------
// getTotalSteps
// ---------------------------------------------------------------------------

describe('getTotalSteps', () => {
  it('returns 0 for empty phases array', () => {
    expect(getTotalSteps([])).toBe(0)
  })

  it('counts steps in a single phase', () => {
    expect(getTotalSteps([makePhase([makeStep(), makeStep({ id: 's2' })])])).toBe(2)
  })

  it('sums steps across multiple phases', () => {
    const phases = [
      makePhase([makeStep(), makeStep({ id: 's2' })], 'phase-1'),
      makePhase([makeStep({ id: 's3' })], 'phase-2'),
    ]
    expect(getTotalSteps(phases)).toBe(3)
  })

  it('handles phases with no steps', () => {
    expect(getTotalSteps([makePhase([])])).toBe(0)
  })
})
