import { type UserChoices } from '../contexts/UserChoicesContext'
import costDatabase from '../data/cost-database.json'
import buildComplexity from '../data/build-complexity.json'

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
    const switchData = costDatabase.switches[
      choices.switchType as keyof typeof costDatabase.switches
    ] as { midrange?: number; standard?: number } | undefined
    const switchPrice: number = switchData?.midrange ?? switchData?.standard ?? 0
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
  } else if (choices.buildMethod === 'complete-kit') {
    breakdown.shipping = costDatabase.shipping.domestic
  } else if (choices.buildMethod) {
    breakdown.shipping = costDatabase.shipping['international-parts']
  }

  // One-time tools cost (basic soldering kit for builds that require it)
  if (choices.buildMethod && choices.buildMethod !== 'complete-kit') {
    breakdown.tools =
      costDatabase.tools['soldering-iron-budget'] +
      costDatabase.tools['solder-spool'] +
      costDatabase.tools.flux +
      costDatabase.tools['wire-cutters']
  }

  // Calculate total
  const total = (Object.values(breakdown) as number[]).reduce((sum, cost) => sum + cost, 0)

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

export function calculateComplexity(choices: UserChoices): number {
  let complexity = 0

  complexity += choices.buildMethod
    ? (buildComplexity.methodComplexity[
        choices.buildMethod as keyof typeof buildComplexity.methodComplexity
      ] ?? 0)
    : 0

  complexity += choices.layout.formFactor
    ? (buildComplexity.layoutComplexity[
        choices.layout.formFactor as keyof typeof buildComplexity.layoutComplexity
      ] ?? 0)
    : 0

  if (choices.features.hotswap) complexity += 0.5
  if (choices.features.rgb) complexity += 2
  if (choices.features.oled) complexity += 1.5
  if (choices.features.encoder) complexity += 1.5
  if (choices.features.trackball) complexity += 4
  if (choices.features.wireless) complexity += 3

  complexity += choices.firmware
    ? (buildComplexity.firmwareComplexity[
        choices.firmware as keyof typeof buildComplexity.firmwareComplexity
      ] ?? 0)
    : 0

  return Math.min(10, Math.max(1, Math.round(complexity / 2)))
}

export function estimateBuildTime(choices: UserChoices): number {
  let hours = 0

  hours += choices.buildMethod
    ? (buildComplexity.methodTime[choices.buildMethod as keyof typeof buildComplexity.methodTime] ??
      0)
    : 0

  hours += choices.layout.formFactor
    ? (buildComplexity.layoutTime[
        choices.layout.formFactor as keyof typeof buildComplexity.layoutTime
      ] ?? 0)
    : 0

  if (choices.features.rgb) hours += 3
  if (choices.features.oled) hours += 1
  if (choices.features.encoder) hours += 1
  if (choices.features.trackball) hours += 8
  if (choices.features.wireless) hours += 5

  hours += choices.firmware
    ? (buildComplexity.firmwareTime[
        choices.firmware as keyof typeof buildComplexity.firmwareTime
      ] ?? 0)
    : 0

  return hours
}
