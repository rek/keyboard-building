import { describe, it, expect } from 'vitest'
import { calculateCost, calculateComplexity, estimateBuildTime } from './costCalculator'
import type { UserChoices } from '../contexts/UserChoicesContext'

// All-null base — no choices made
const base: UserChoices = {
  buildMethod: null,
  layout: { formFactor: null, keyCount: 60 },
  controller: null,
  switchType: null,
  features: {
    hotswap: false,
    rgb: false,
    oled: false,
    encoder: false,
    trackball: false,
    wireless: false,
  },
  connectivity: null,
  firmware: null,
}

// ---------------------------------------------------------------------------
// calculateCost
// ---------------------------------------------------------------------------

describe('calculateCost', () => {
  describe('controller', () => {
    it('costs zero when null', () => {
      expect(calculateCost(base).breakdown.controller).toBe(0)
    })

    it('multiplies unit price by 2 for split keyboard', () => {
      // pro-micro base: $5.00 → $10 for split
      expect(calculateCost({ ...base, controller: 'pro-micro' }).breakdown.controller).toBe(10)
    })

    it('uses the base price field', () => {
      // elite-c base: $18.00 → $36
      expect(calculateCost({ ...base, controller: 'elite-c' }).breakdown.controller).toBe(36)
    })
  })

  describe('switches', () => {
    it('costs zero when switchType is null', () => {
      expect(calculateCost(base).breakdown.switches).toBe(0)
    })

    it('uses midrange price when available (mx)', () => {
      // mx midrange: $0.35 × 60 = $21
      const result = calculateCost({ ...base, switchType: 'mx' })
      expect(result.breakdown.switches).toBe(21)
    })

    it('falls back to standard price when no midrange (choc-v1)', () => {
      // choc-v1 has no midrange, standard: $0.60 × 60 = $36
      const result = calculateCost({ ...base, switchType: 'choc-v1' })
      expect(result.breakdown.switches).toBe(36)
    })

    it('scales with keyCount', () => {
      // mx midrange: $0.35 × 100 = $35
      const result = calculateCost({
        ...base,
        switchType: 'mx',
        layout: { ...base.layout, keyCount: 100 },
      })
      expect(result.breakdown.switches).toBe(35)
    })
  })

  describe('keycaps', () => {
    it('uses mx-midrange ($60) for mx switches', () => {
      expect(calculateCost({ ...base, switchType: 'mx' }).breakdown.keycaps).toBe(60)
    })

    it('uses choc-v1 keycap price ($40)', () => {
      expect(calculateCost({ ...base, switchType: 'choc-v1' }).breakdown.keycaps).toBe(40)
    })

    it('uses choc-v2 keycap price ($50)', () => {
      expect(calculateCost({ ...base, switchType: 'choc-v2' }).breakdown.keycaps).toBe(50)
    })

    it('is zero for unrecognised switch types', () => {
      expect(calculateCost({ ...base, switchType: 'alps' }).breakdown.keycaps).toBe(0)
    })
  })

  describe('build method costs', () => {
    it('handwired charges hardware (wire $8 + diodes $2 + hardware $5 = $15)', () => {
      const r = calculateCost({ ...base, buildMethod: 'handwired' })
      expect(r.breakdown.hardware).toBe(15)
      expect(r.breakdown.pcb).toBe(0)
    })

    it('custom-pcb charges pcb ($45) and hardware (diodes $2 + hardware $10 = $12)', () => {
      const r = calculateCost({ ...base, buildMethod: 'custom-pcb' })
      expect(r.breakdown.pcb).toBe(45)
      expect(r.breakdown.hardware).toBe(12)
    })

    it('pcb-kit charges pcb/kit ($60) and case ($40)', () => {
      const r = calculateCost({ ...base, buildMethod: 'pcb-kit' })
      expect(r.breakdown.pcb).toBe(60)
      expect(r.breakdown.case).toBe(40)
    })

    it('complete-kit charges keyboard price ($250) as pcb line', () => {
      const r = calculateCost({ ...base, buildMethod: 'complete-kit' })
      expect(r.breakdown.pcb).toBe(250)
    })
  })

  describe('case cost — ergonomic-3d layout', () => {
    it('adds 3d-print-diy case cost ($20) for ergonomic-3d without a build method', () => {
      const r = calculateCost({ ...base, layout: { formFactor: 'ergonomic-3d', keyCount: 60 } })
      expect(r.breakdown.case).toBe(20)
    })

    it('overwrites pcb-kit case cost when combined with ergonomic-3d layout', () => {
      // BUG: pcb-kit sets case=$40, then ergonomic-3d overwrites it to $20.
      // The kit-included case ($40) is silently dropped from the estimate.
      // This test documents the current (incorrect) behaviour.
      const r = calculateCost({
        ...base,
        buildMethod: 'pcb-kit',
        layout: { formFactor: 'ergonomic-3d', keyCount: 60 },
      })
      expect(r.breakdown.case).toBe(20) // BUG: should be 40 (kit case replaced, not added)
    })
  })

  describe('features', () => {
    it('hotswap adds per-switch cost (60 × $0.30 = $18) when switchType is set', () => {
      const r = calculateCost({
        ...base,
        switchType: 'mx',
        features: { ...base.features, hotswap: true },
      })
      expect(r.breakdown.features).toBe(18)
    })

    it('hotswap cost is zero when no switchType selected (cost is gated on switchType)', () => {
      const r = calculateCost({ ...base, features: { ...base.features, hotswap: true } })
      expect(r.breakdown.features).toBe(0)
    })

    it('rgb adds per-key cost (60 × $0.25 = $15)', () => {
      const r = calculateCost({ ...base, features: { ...base.features, rgb: true } })
      expect(r.breakdown.features).toBe(15)
    })

    it('oled adds 2× display cost ($4.00 × 2 = $8)', () => {
      const r = calculateCost({ ...base, features: { ...base.features, oled: true } })
      expect(r.breakdown.features).toBe(8)
    })

    it('encoder adds 2× cost ($2.50 × 2 = $5)', () => {
      const r = calculateCost({ ...base, features: { ...base.features, encoder: true } })
      expect(r.breakdown.features).toBe(5)
    })

    it('trackball adds pmw3360 sensor cost ($35)', () => {
      const r = calculateCost({ ...base, features: { ...base.features, trackball: true } })
      expect(r.breakdown.features).toBe(35)
    })

    it('accumulates multiple feature costs', () => {
      // oled ($8) + encoder ($5) = $13
      const r = calculateCost({
        ...base,
        features: { ...base.features, oled: true, encoder: true },
      })
      expect(r.breakdown.features).toBe(13)
    })
  })

  describe('connectivity', () => {
    it('is zero when null', () => {
      expect(calculateCost(base).breakdown.connectivity).toBe(0)
    })

    it('trrs = cable ($5) + 2 jacks ($1 each) = $7', () => {
      const r = calculateCost({ ...base, connectivity: 'trrs' })
      expect(r.breakdown.connectivity).toBe(7)
    })

    it('wireless = 2 batteries ($8 each) + 2 power switches ($1.50 each) = $19', () => {
      const r = calculateCost({ ...base, connectivity: 'wireless' })
      expect(r.breakdown.connectivity).toBe(19)
    })
  })

  describe('shipping', () => {
    it('custom-pcb gets international-pcb rate ($15)', () => {
      expect(calculateCost({ ...base, buildMethod: 'custom-pcb' }).breakdown.shipping).toBe(15)
    })

    it('complete-kit gets domestic rate ($5)', () => {
      expect(calculateCost({ ...base, buildMethod: 'complete-kit' }).breakdown.shipping).toBe(5)
    })

    it('handwired gets international-parts rate ($10)', () => {
      expect(calculateCost({ ...base, buildMethod: 'handwired' }).breakdown.shipping).toBe(10)
    })

    it('pcb-kit gets international-parts rate ($10)', () => {
      expect(calculateCost({ ...base, buildMethod: 'pcb-kit' }).breakdown.shipping).toBe(10)
    })

    it('null buildMethod has zero shipping cost', () => {
      // BUG: null !== 'complete-kit' is true, so international-parts ($10) is applied
      // even when no build method has been chosen. Should be $0.
      expect(calculateCost(base).breakdown.shipping).toBe(0)
    })
  })

  describe('tools', () => {
    it('charges soldering kit for non-complete-kit builds ($25+$8+$6+$10 = $49)', () => {
      expect(calculateCost({ ...base, buildMethod: 'handwired' }).breakdown.tools).toBe(49)
    })

    it('no tools cost for complete-kit', () => {
      expect(calculateCost({ ...base, buildMethod: 'complete-kit' }).breakdown.tools).toBe(0)
    })

    it('no tools cost when buildMethod is null', () => {
      expect(calculateCost(base).breakdown.tools).toBe(0)
    })
  })

  describe('total and perHalf', () => {
    it('total equals sum of all breakdown categories', () => {
      const r = calculateCost({
        ...base,
        controller: 'pro-micro',
        switchType: 'mx',
        buildMethod: 'handwired',
        connectivity: 'trrs',
        firmware: 'qmk',
      })
      const sumOfBreakdown = Object.values(r.breakdown).reduce((a, b) => a + b, 0)
      expect(r.total).toBeCloseTo(sumOfBreakdown)
    })

    it('each perHalf value is exactly half of the full breakdown', () => {
      const r = calculateCost({
        ...base,
        controller: 'pro-micro',
        switchType: 'mx',
        buildMethod: 'handwired',
        features: { ...base.features, oled: true },
      })
      for (const key of Object.keys(r.breakdown) as (keyof typeof r.breakdown)[]) {
        expect(r.perHalf[key]).toBe(r.breakdown[key] / 2)
      }
    })
  })
})

// ---------------------------------------------------------------------------
// calculateComplexity
// ---------------------------------------------------------------------------

describe('calculateComplexity', () => {
  it('returns minimum 1 when no choices are made (raw score 0 → clamped)', () => {
    expect(calculateComplexity(base)).toBe(1)
  })

  it('adds build method complexity (handwired=4, /2 → 2)', () => {
    expect(calculateComplexity({ ...base, buildMethod: 'handwired' })).toBe(2)
  })

  it('adds layout complexity (ergonomic-3d=5, /2=2.5 → rounds to 3)', () => {
    expect(
      calculateComplexity({ ...base, layout: { formFactor: 'ergonomic-3d', keyCount: 60 } }),
    ).toBe(3)
  })

  it('adds firmware complexity (zmk=4, /2 → 2)', () => {
    expect(calculateComplexity({ ...base, firmware: 'zmk' })).toBe(2)
  })

  it('adds feature complexity (trackball=4, /2 → 2)', () => {
    expect(
      calculateComplexity({ ...base, features: { ...base.features, trackball: true } }),
    ).toBe(2)
  })

  it('combines all dimensions correctly (handwired=4 + ergonomic-3d=5 + qmk=3 = 12, /2 → 6)', () => {
    expect(
      calculateComplexity({
        ...base,
        buildMethod: 'handwired',
        layout: { formFactor: 'ergonomic-3d', keyCount: 60 },
        firmware: 'qmk',
      }),
    ).toBe(6)
  })

  it('clamps at maximum of 10 for extreme builds', () => {
    // custom-pcb=5 + ergonomic-3d=5 + zmk=4 + all features=12.5 → raw=26.5, /2=13.25 → 10
    expect(
      calculateComplexity({
        ...base,
        buildMethod: 'custom-pcb',
        layout: { formFactor: 'ergonomic-3d', keyCount: 60 },
        firmware: 'zmk',
        features: {
          hotswap: true,
          rgb: true,
          oled: true,
          encoder: true,
          trackball: true,
          wireless: true,
        },
      }),
    ).toBe(10)
  })

  it('handles unknown buildMethod gracefully (contributes 0)', () => {
    expect(calculateComplexity({ ...base, buildMethod: 'unknown-method' })).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// estimateBuildTime
// ---------------------------------------------------------------------------

describe('estimateBuildTime', () => {
  it('returns 0 when no choices are made', () => {
    expect(estimateBuildTime(base)).toBe(0)
  })

  it('adds build method time (handwired = 15h)', () => {
    expect(estimateBuildTime({ ...base, buildMethod: 'handwired' })).toBe(15)
  })

  it('adds layout time (ergonomic-3d = 20h)', () => {
    expect(
      estimateBuildTime({ ...base, layout: { formFactor: 'ergonomic-3d', keyCount: 60 } }),
    ).toBe(20)
  })

  it('adds firmware time (qmk = 2h)', () => {
    expect(estimateBuildTime({ ...base, firmware: 'qmk' })).toBe(2)
  })

  it('adds feature time (trackball = 8h, wireless = 5h)', () => {
    expect(
      estimateBuildTime({
        ...base,
        features: { ...base.features, trackball: true, wireless: true },
      }),
    ).toBe(13)
  })

  it('accumulates all contributions (handwired=15 + ergonomic-3d=20 + qmk=2 = 37h)', () => {
    expect(
      estimateBuildTime({
        ...base,
        buildMethod: 'handwired',
        layout: { formFactor: 'ergonomic-3d', keyCount: 60 },
        firmware: 'qmk',
      }),
    ).toBe(37)
  })

  it('contributes 0 for unknown values', () => {
    expect(estimateBuildTime({ ...base, buildMethod: 'unknown' })).toBe(0)
  })
})
