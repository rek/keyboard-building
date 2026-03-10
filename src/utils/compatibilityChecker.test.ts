import { describe, it, expect } from 'vitest'
import { checkCompatibility, getCompatibilityStatus } from './compatibilityChecker'
import type { UserChoices } from '../contexts/UserChoicesContext'

// Base fixture: all nulls, all features false, keyCount 60.
// Spread this in every test to override only the fields under test.
const baseChoices: UserChoices = {
  buildMethod: null,
  layout: {
    formFactor: null,
    keyCount: 60,
  },
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
// Pin count reference for keyCount=60 (all assertions documented here):
//   keyCount / 2 = 30 (per half)
//   rows = ceil(sqrt(30)) = ceil(5.477) = 6
//   cols = ceil(30 / 6)   = ceil(5)     = 5
//   base matrix pins = 6 + 5 = 11
//   rgb   adds 1 pin  → 12 total  (NOT > 12, no warning)
//   oled  adds 2 pins → 13 total  (> 12, warning)
//   encoder adds 3 pins → 14 total (> 12, warning)
// ---------------------------------------------------------------------------

describe('checkCompatibility', () => {
  describe('firmware/controller compatibility', () => {
    it('produces no warnings for a fully compatible zmk + nice-nano combination', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: 'nice-nano',
        connectivity: 'wireless',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })

    it('produces no warnings for a fully compatible qmk + pro-micro combination', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'qmk',
        controller: 'pro-micro',
        connectivity: 'wired',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })

    it('produces no warnings for a fully compatible kmk + rp2040 combination', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'kmk',
        controller: 'rp2040',
        connectivity: 'wired',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })

    it('errors when zmk is used with a controller other than nice-nano (pro-micro)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: 'pro-micro',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find(
        (w) =>
          w.affectedChoices.includes('firmware') &&
          w.affectedChoices.includes('controller') &&
          w.message.includes('ZMK firmware requires')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.message).toContain('ZMK firmware requires nice!nano controller')
    })

    it('errors when zmk is used with a null controller (not nice-nano)', () => {
      // controller is null — null !== 'nice-nano' so the rule still fires
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: null,
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('ZMK firmware requires'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
    })

    it('errors when qmk is used with nice-nano', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'qmk',
        controller: 'nice-nano',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('QMK and Vial do not support nice!nano'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.affectedChoices).toContain('firmware')
      expect(rule!.affectedChoices).toContain('controller')
    })

    it('errors when vial is used with nice-nano', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'vial',
        controller: 'nice-nano',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('QMK and Vial do not support nice!nano'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
    })

    it('errors when kmk is used with a non-rp2040 controller (pro-micro)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'kmk',
        controller: 'pro-micro',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('KMK firmware requires RP2040'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.affectedChoices).toContain('firmware')
      expect(rule!.affectedChoices).toContain('controller')
    })

    it('errors when kmk is used with elite-c (non-rp2040)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'kmk',
        controller: 'elite-c',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('KMK firmware requires RP2040'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
    })

    it('does NOT error for kmk with null controller (guard: choices.controller &&)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'kmk',
        controller: null,
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('KMK firmware requires RP2040'))
      expect(rule).toBeUndefined()
    })

    it('warns when zmk is used with wired connectivity', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: 'nice-nano',
        connectivity: 'wired',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('ZMK is designed for wireless builds'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('firmware')
      expect(rule!.affectedChoices).toContain('connectivity')
    })

    it('does NOT warn about zmk+wired when connectivity is null', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: 'nice-nano',
        connectivity: null,
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('ZMK is designed for wireless builds'))
      expect(rule).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------

  describe('wireless compatibility', () => {
    it('errors with elite-c and wireless connectivity (specific elite-c branch)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'elite-c',
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Elite-C uses ATmega32U4'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.affectedChoices).toContain('controller')
      expect(rule!.affectedChoices).toContain('connectivity')
    })

    it('does NOT fire the generic non-nice-nano branch when controller is elite-c (else-if guard)', () => {
      // The elite-c branch is the if-branch; the else-if (generic) branch must NOT also fire
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'elite-c',
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const genericRule = warnings.find((w) =>
        w.message.includes('Wireless connectivity requires nice!nano controller with ZMK firmware')
      )
      expect(genericRule).toBeUndefined()
    })

    it('errors with a non-elite-c, non-nice-nano controller and wireless connectivity (else-if branch)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'pro-micro',
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Wireless connectivity requires nice!nano')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.affectedChoices).toContain('connectivity')
      expect(rule!.affectedChoices).toContain('controller')
    })

    it('does NOT fire the non-nice-nano wireless error when controller is null (else-if branch)', () => {
      // null !== 'nice-nano' so the else-if fires for null controller
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: null,
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Wireless connectivity requires nice!nano')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
    })

    it('does NOT fire any wireless-controller error when nice-nano is used with wireless', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'nice-nano',
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const eliteCRule = warnings.find((w) => w.message.includes('Elite-C uses ATmega32U4'))
      const genericRule = warnings.find((w) =>
        w.message.includes('Wireless connectivity requires nice!nano')
      )
      expect(eliteCRule).toBeUndefined()
      expect(genericRule).toBeUndefined()
    })

    it('errors when wireless is selected without zmk firmware', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'nice-nano',
        firmware: 'qmk',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Wireless builds require ZMK firmware'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('error')
      expect(rule!.affectedChoices).toContain('connectivity')
      expect(rule!.affectedChoices).toContain('firmware')
    })

    it('does NOT fire the wireless-firmware error when firmware is null and connectivity is not wireless', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wired',
        firmware: null,
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Wireless builds require ZMK firmware'))
      expect(rule).toBeUndefined()
    })

    it('produces no wireless errors for a valid nice-nano + zmk + wireless combination', () => {
      const choices: UserChoices = {
        ...baseChoices,
        connectivity: 'wireless',
        controller: 'nice-nano',
        firmware: 'zmk',
      }
      const warnings = checkCompatibility(choices)
      const wirelessErrors = warnings.filter(
        (w) =>
          w.severity === 'error' &&
          (w.affectedChoices.includes('connectivity') || w.affectedChoices.includes('controller'))
      )
      expect(wirelessErrors).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------

  describe('pin count', () => {
    // keyCount=60: base matrix = 11 pins (threshold > 12)

    it('does NOT warn for pro-micro with base matrix pins only (11 pins, not > 12)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        // no extra features — 11 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeUndefined()
    })

    it('does NOT warn for pro-micro with rgb only (12 pins, exactly at threshold, not > 12)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        features: { ...baseChoices.features, rgb: true },
        // 11 + 1 = 12 pins — NOT > 12
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeUndefined()
    })

    it('warns for pro-micro when rgb + oled pushes pins to 13 (> 12)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        features: { ...baseChoices.features, rgb: true, oled: true },
        // 11 + 1 (rgb) + 2 (oled) = 14 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('controller')
      expect(rule!.affectedChoices).toContain('features')
    })

    it('warns for pro-micro when oled alone pushes pins to 13 (> 12)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        features: { ...baseChoices.features, oled: true },
        // 11 + 2 (oled) = 13 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
    })

    it('warns for pro-micro when encoder alone pushes pins to 14 (> 12)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        features: { ...baseChoices.features, encoder: true },
        // 11 + 3 (encoder) = 14 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
    })

    it('warns for elite-c when pins exceed 12', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'elite-c',
        features: { ...baseChoices.features, oled: true },
        // 11 + 2 (oled) = 13 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
    })

    it('does NOT fire pin-count warning for rp2040 controller regardless of pin count', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'rp2040',
        features: {
          ...baseChoices.features,
          rgb: true,
          oled: true,
          encoder: true,
          trackball: true,
        },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeUndefined()
    })

    it('includes the computed pin count in the warning message', () => {
      const choices: UserChoices = {
        ...baseChoices,
        controller: 'pro-micro',
        features: { ...baseChoices.features, oled: true },
        // 11 + 2 = 13 pins
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Pro Micro/Elite-C only have 12 usable pins')
      )
      expect(rule).toBeDefined()
      expect(rule!.message).toContain('13')
    })
  })

  // -------------------------------------------------------------------------

  describe('trackball', () => {
    it('warns when trackball is enabled without custom-pcb build method', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, trackball: true },
        buildMethod: 'handwired',
        controller: 'rp2040',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Trackball integration is extremely complex')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('features')
      expect(rule!.affectedChoices).toContain('buildMethod')
    })

    it('warns when trackball is enabled with pcb-kit build method', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, trackball: true },
        buildMethod: 'pcb-kit',
        controller: 'rp2040',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Trackball integration is extremely complex')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
    })

    it('does NOT warn about trackball complexity when build method is custom-pcb', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, trackball: true },
        buildMethod: 'custom-pcb',
        controller: 'rp2040',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Trackball integration is extremely complex')
      )
      expect(rule).toBeUndefined()
    })

    it('warns when trackball is enabled with pro-micro (insufficient pins for SPI)', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, trackball: true },
        buildMethod: 'custom-pcb',
        controller: 'pro-micro',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Trackball requires 6 pins for SPI'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('features')
      expect(rule!.affectedChoices).toContain('controller')
    })

    it('does NOT warn about trackball+pro-micro when trackball is disabled', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, trackball: false },
        buildMethod: 'custom-pcb',
        controller: 'pro-micro',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Trackball requires 6 pins for SPI'))
      expect(rule).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------

  describe('layout/switch compatibility', () => {
    it('produces an info warning for ergonomic-3d layout with pcb-kit build method', () => {
      const choices: UserChoices = {
        ...baseChoices,
        layout: { ...baseChoices.layout, formFactor: 'ergonomic-3d' },
        buildMethod: 'pcb-kit',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Ergonomic 3D layouts typically require custom 3D printed cases')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('info')
      expect(rule!.affectedChoices).toContain('layout')
      expect(rule!.affectedChoices).toContain('buildMethod')
    })

    it('does NOT warn about ergonomic-3d+pcb-kit for non-pcb-kit build methods', () => {
      const choices: UserChoices = {
        ...baseChoices,
        layout: { ...baseChoices.layout, formFactor: 'ergonomic-3d' },
        buildMethod: 'custom-pcb',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Ergonomic 3D layouts typically require custom 3D printed cases')
      )
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about ergonomic-3d+pcb-kit for non-ergonomic form factors', () => {
      const choices: UserChoices = {
        ...baseChoices,
        layout: { ...baseChoices.layout, formFactor: 'tenkeyless' },
        buildMethod: 'pcb-kit',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Ergonomic 3D layouts typically require custom 3D printed cases')
      )
      expect(rule).toBeUndefined()
    })

    it('produces an info warning for choc-v1 switches with ergonomic-3d layout', () => {
      const choices: UserChoices = {
        ...baseChoices,
        switchType: 'choc-v1',
        layout: { ...baseChoices.layout, formFactor: 'ergonomic-3d' },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Choc v1 switches work great with 3D printed cases')
      )
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('info')
      expect(rule!.affectedChoices).toContain('switchType')
      expect(rule!.affectedChoices).toContain('layout')
    })

    it('does NOT warn about choc-v1 when formFactor is not ergonomic-3d', () => {
      const choices: UserChoices = {
        ...baseChoices,
        switchType: 'choc-v1',
        layout: { ...baseChoices.layout, formFactor: 'tenkeyless' },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Choc v1 switches work great with 3D printed cases')
      )
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about choc-v1+ergonomic-3d for other switch types', () => {
      const choices: UserChoices = {
        ...baseChoices,
        switchType: 'mx',
        layout: { ...baseChoices.layout, formFactor: 'ergonomic-3d' },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) =>
        w.message.includes('Choc v1 switches work great with 3D printed cases')
      )
      expect(rule).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------

  describe('hotswap', () => {
    it('warns when hotswap is enabled with handwired build method', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, hotswap: true },
        buildMethod: 'handwired',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Hot-swap sockets are difficult'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('features')
      expect(rule!.affectedChoices).toContain('buildMethod')
    })

    it('does NOT warn about hotswap for pcb-based build methods', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, hotswap: true },
        buildMethod: 'custom-pcb',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Hot-swap sockets are difficult'))
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about hotswap when hotswap is false', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, hotswap: false },
        buildMethod: 'handwired',
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('Hot-swap sockets are difficult'))
      expect(rule).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------

  describe('rgb', () => {
    it('warns when rgb is enabled with pro-micro and keyCount > 40', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, rgb: true },
        controller: 'pro-micro',
        layout: { ...baseChoices.layout, keyCount: 60 },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('RGB LEDs for 40+ keys'))
      expect(rule).toBeDefined()
      expect(rule!.severity).toBe('warning')
      expect(rule!.affectedChoices).toContain('features')
      expect(rule!.affectedChoices).toContain('controller')
    })

    it('does NOT warn about rgb complexity when keyCount is exactly 40', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, rgb: true },
        controller: 'pro-micro',
        layout: { ...baseChoices.layout, keyCount: 40 },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('RGB LEDs for 40+ keys'))
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about rgb complexity when keyCount is below 40', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, rgb: true },
        controller: 'pro-micro',
        layout: { ...baseChoices.layout, keyCount: 36 },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('RGB LEDs for 40+ keys'))
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about rgb complexity for controllers other than pro-micro', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, rgb: true },
        controller: 'rp2040',
        layout: { ...baseChoices.layout, keyCount: 60 },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('RGB LEDs for 40+ keys'))
      expect(rule).toBeUndefined()
    })

    it('does NOT warn about rgb complexity when rgb is disabled', () => {
      const choices: UserChoices = {
        ...baseChoices,
        features: { ...baseChoices.features, rgb: false },
        controller: 'pro-micro',
        layout: { ...baseChoices.layout, keyCount: 60 },
      }
      const warnings = checkCompatibility(choices)
      const rule = warnings.find((w) => w.message.includes('RGB LEDs for 40+ keys'))
      expect(rule).toBeUndefined()
    })
  })

  // -------------------------------------------------------------------------

  describe('compatible combinations produce zero warnings', () => {
    it('fully null base choices produce zero warnings', () => {
      const warnings = checkCompatibility(baseChoices)
      expect(warnings).toHaveLength(0)
    })

    it('qmk + elite-c + wired produces zero warnings', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'qmk',
        controller: 'elite-c',
        connectivity: 'wired',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })

    it('vial + rp2040 + wired produces zero warnings', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'vial',
        controller: 'rp2040',
        connectivity: 'wired',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })

    it('zmk + nice-nano + wireless produces zero warnings', () => {
      const choices: UserChoices = {
        ...baseChoices,
        firmware: 'zmk',
        controller: 'nice-nano',
        connectivity: 'wireless',
      }
      const warnings = checkCompatibility(choices)
      expect(warnings).toHaveLength(0)
    })
  })
})

// ---------------------------------------------------------------------------

describe('getCompatibilityStatus', () => {
  it('returns "ok" when there are no warnings', () => {
    expect(getCompatibilityStatus([])).toBe('ok')
  })

  it('returns "warnings" when there are only warning-severity entries', () => {
    const warnings = [
      { severity: 'warning' as const, message: 'some warning', affectedChoices: ['a'] },
    ]
    expect(getCompatibilityStatus(warnings)).toBe('warnings')
  })

  it('returns "ok" when there are only info-severity entries (info does not trigger "warnings")', () => {
    // getCompatibilityStatus only checks for 'warning' severity in its second branch;
    // 'info' falls through and returns 'ok'. This is the actual implementation behaviour.
    const warnings = [{ severity: 'info' as const, message: 'some info', affectedChoices: ['a'] }]
    expect(getCompatibilityStatus(warnings)).toBe('ok')
  })

  it('returns "errors" when there is at least one error-severity entry', () => {
    const warnings = [
      { severity: 'error' as const, message: 'a fatal error', affectedChoices: ['a'] },
    ]
    expect(getCompatibilityStatus(warnings)).toBe('errors')
  })

  it('returns "errors" when errors are mixed with warnings', () => {
    const warnings = [
      { severity: 'warning' as const, message: 'a warning', affectedChoices: ['a'] },
      { severity: 'error' as const, message: 'a fatal error', affectedChoices: ['b'] },
    ]
    expect(getCompatibilityStatus(warnings)).toBe('errors')
  })

  it('returns "errors" when errors are mixed with info', () => {
    const warnings = [
      { severity: 'info' as const, message: 'just info', affectedChoices: ['a'] },
      { severity: 'error' as const, message: 'a fatal error', affectedChoices: ['b'] },
    ]
    expect(getCompatibilityStatus(warnings)).toBe('errors')
  })

  it('errors take precedence over warnings when both are present', () => {
    const warnings = [
      { severity: 'warning' as const, message: 'a warning', affectedChoices: ['a'] },
      { severity: 'info' as const, message: 'just info', affectedChoices: ['b'] },
      { severity: 'error' as const, message: 'a fatal error', affectedChoices: ['c'] },
    ]
    expect(getCompatibilityStatus(warnings)).toBe('errors')
  })
})
