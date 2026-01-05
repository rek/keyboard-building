import { type UserChoices } from '../contexts/UserChoicesContext'
import costDatabase from '../data/cost-database.json'

export interface CostBreakdown {
  controller: number
  switches: number
  keycaps: number
  pcb: number
  case: number
  hardware: number
  features: number
  connectivity: number
  shipping: number
  tools: number
}

export interface CostEstimate {
  breakdown: CostBreakdown
  total: number
  perHalf: CostBreakdown
}

export function calculateCost(choices: UserChoices): CostEstimate {
  const breakdown: CostBreakdown = {
    controller: 0,
    switches: 0,
    keycaps: 0,
    pcb: 0,
    case: 0,
    hardware: 0,
    features: 0,
    connectivity: 0,
    shipping: 0,
    tools: 0,
  }

  // Controller - need 2 for split keyboard
  if (choices.controller) {
    const controllerPrice =
      costDatabase.controllers[choices.controller as keyof typeof costDatabase.controllers]?.base ||
      0
    breakdown.controller = controllerPrice * 2
  }

  // Switches - based on key count
  if (choices.switchType) {
    const switchCount = choices.layout.keyCount
    const switchPrice =
      costDatabase.switches[choices.switchType as keyof typeof costDatabase.switches]?.midrange || 0
    breakdown.switches = switchCount * switchPrice

    // Hot-swap sockets
    if (choices.features.hotswap) {
      breakdown.features += switchCount * costDatabase.features['hotswap-socket']
    }
  }

  // Keycaps
  if (choices.switchType === 'mx') {
    breakdown.keycaps = costDatabase.keycaps['mx-midrange']
  } else if (choices.switchType === 'choc-v1') {
    breakdown.keycaps = costDatabase.keycaps['choc-v1']
  } else if (choices.switchType === 'choc-v2') {
    breakdown.keycaps = costDatabase.keycaps['choc-v2']
  }

  // Build method costs
  if (choices.buildMethod === 'handwired') {
    breakdown.hardware =
      costDatabase.buildMethodExtras.handwired.wire +
      costDatabase.buildMethodExtras.handwired.diodes +
      costDatabase.buildMethodExtras.handwired.hardware
  } else if (choices.buildMethod === 'custom-pcb') {
    breakdown.pcb = costDatabase.buildMethodExtras['custom-pcb'].pcb
    breakdown.hardware =
      costDatabase.buildMethodExtras['custom-pcb'].diodes +
      costDatabase.buildMethodExtras['custom-pcb'].hardware
  } else if (choices.buildMethod === 'pcb-kit') {
    breakdown.pcb = costDatabase.buildMethodExtras['pcb-kit'].kit
    breakdown.case = costDatabase.buildMethodExtras['pcb-kit'].case
  } else if (choices.buildMethod === 'complete-kit') {
    breakdown.pcb = costDatabase.buildMethodExtras['complete-kit'].keyboard
  }

  // Case costs for 3D layouts
  if (choices.layout.formFactor === 'ergonomic-3d') {
    breakdown.case = costDatabase.case['3d-print-diy']
  }

  // RGB LEDs
  if (choices.features.rgb) {
    const switchCount = choices.layout.keyCount
    breakdown.features += switchCount * costDatabase.features['rgb-led']
  }

  // OLED displays (2x for split keyboard)
  if (choices.features.oled) {
    breakdown.features += costDatabase.features['oled-display'] * 2
  }

  // Rotary encoders (assume 1 per half)
  if (choices.features.encoder) {
    breakdown.features += costDatabase.features.encoder * 2
  }

  // Trackball (PMW3360 sensor + bearings)
  if (choices.features.trackball) {
    breakdown.features += costDatabase.features['trackball-pmw3360']
  }

  // Connectivity
  if (choices.connectivity === 'trrs') {
    breakdown.connectivity =
      costDatabase.connectivity['trrs-cable'] + costDatabase.connectivity['trrs-jack'] * 2
  } else if (choices.connectivity === 'wireless') {
    breakdown.connectivity =
      costDatabase.connectivity['battery-lipo'] * 2 + costDatabase.connectivity['power-switch'] * 2
  }

  // Shipping estimate
  if (choices.buildMethod === 'custom-pcb') {
    breakdown.shipping = costDatabase.shipping['international-pcb']
  } else if (choices.buildMethod !== 'complete-kit') {
    breakdown.shipping = costDatabase.shipping['international-parts']
  } else {
    breakdown.shipping = costDatabase.shipping.domestic
  }

  // Calculate total
  const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0)

  // Calculate per-half breakdown (for display purposes)
  const perHalf: CostBreakdown = {
    controller: breakdown.controller / 2,
    switches: breakdown.switches / 2,
    keycaps: breakdown.keycaps / 2,
    pcb: breakdown.pcb / 2,
    case: breakdown.case / 2,
    hardware: breakdown.hardware / 2,
    features: breakdown.features / 2,
    connectivity: breakdown.connectivity / 2,
    shipping: breakdown.shipping / 2,
    tools: breakdown.tools / 2,
  }

  return {
    breakdown,
    total,
    perHalf,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateComplexity(choices: UserChoices): number {
  let complexity = 0

  // Base complexity from build method
  const methodComplexity: Record<string, number> = {
    handwired: 4,
    'custom-pcb': 5,
    'pcb-kit': 2,
    'complete-kit': 1,
  }
  complexity += choices.buildMethod ? methodComplexity[choices.buildMethod] || 0 : 0

  // Layout complexity
  const layoutComplexity: Record<string, number> = {
    'ergonomic-3d': 5,
    'flat-splay': 3,
    'standard-split': 2,
  }
  complexity += choices.layout.formFactor ? layoutComplexity[choices.layout.formFactor] || 0 : 0

  // Feature complexity
  if (choices.features.hotswap) complexity += 0.5
  if (choices.features.rgb) complexity += 2
  if (choices.features.oled) complexity += 1.5
  if (choices.features.encoder) complexity += 1.5
  if (choices.features.trackball) complexity += 4
  if (choices.features.wireless) complexity += 3

  // Firmware complexity
  const firmwareComplexity: Record<string, number> = {
    qmk: 3,
    vial: 1,
    kmk: 2,
    zmk: 4,
  }
  complexity += choices.firmware ? firmwareComplexity[choices.firmware] || 0 : 0

  // Normalize to 1-10 scale
  return Math.min(10, Math.max(1, Math.round(complexity / 2)))
}

export function estimateBuildTime(choices: UserChoices): number {
  let hours = 0

  // Base time from build method
  const methodTime: Record<string, number> = {
    handwired: 15,
    'custom-pcb': 40,
    'pcb-kit': 5,
    'complete-kit': 1,
  }
  hours += choices.buildMethod ? methodTime[choices.buildMethod] || 0 : 0

  // Layout time
  const layoutTime: Record<string, number> = {
    'ergonomic-3d': 20,
    'flat-splay': 10,
    'standard-split': 5,
  }
  hours += choices.layout.formFactor ? layoutTime[choices.layout.formFactor] || 0 : 0

  // Feature time
  if (choices.features.rgb) hours += 3
  if (choices.features.oled) hours += 1
  if (choices.features.encoder) hours += 1
  if (choices.features.trackball) hours += 8
  if (choices.features.wireless) hours += 5

  // Firmware setup time
  const firmwareTime: Record<string, number> = {
    qmk: 2,
    vial: 1,
    kmk: 2,
    zmk: 3,
  }
  hours += choices.firmware ? firmwareTime[choices.firmware] || 0 : 0

  return hours
}
