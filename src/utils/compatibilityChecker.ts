import { type UserChoices } from '../contexts/UserChoicesContext'

export interface CompatibilityWarning {
  severity: 'error' | 'warning' | 'info'
  message: string
  affectedChoices: string[]
}

export function checkCompatibility(choices: UserChoices): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = []

  // Check firmware and controller compatibility
  if (choices.firmware === 'zmk' && choices.controller !== 'nice-nano') {
    warnings.push({
      severity: 'error',
      message:
        'ZMK firmware requires nice!nano controller. QMK, Vial, and KMK are not supported with nice!nano.',
      affectedChoices: ['firmware', 'controller'],
    })
  }

  if (
    (choices.firmware === 'qmk' || choices.firmware === 'vial') &&
    choices.controller === 'nice-nano'
  ) {
    warnings.push({
      severity: 'error',
      message: 'QMK and Vial do not support nice!nano. Use ZMK firmware for wireless builds.',
      affectedChoices: ['firmware', 'controller'],
    })
  }

  if (choices.firmware === 'kmk' && choices.controller !== 'rp2040') {
    warnings.push({
      severity: 'error',
      message:
        'KMK firmware requires RP2040-based controllers (CircuitPython compatible). Consider using QMK/Vial for ATmega32U4 boards.',
      affectedChoices: ['firmware', 'controller'],
    })
  }

  // Check wireless compatibility
  if (choices.connectivity === 'wireless' && choices.controller !== 'nice-nano') {
    warnings.push({
      severity: 'error',
      message: 'Wireless connectivity requires nice!nano controller with ZMK firmware.',
      affectedChoices: ['connectivity', 'controller'],
    })
  }

  if (choices.connectivity === 'wireless' && choices.firmware !== 'zmk') {
    warnings.push({
      severity: 'error',
      message: 'Wireless builds require ZMK firmware. QMK, Vial, and KMK do not support wireless.',
      affectedChoices: ['connectivity', 'firmware'],
    })
  }

  // Check pin count requirements
  if (choices.controller === 'pro-micro' || choices.controller === 'elite-c') {
    const pinCount = calculatePinRequirements(choices)
    if (pinCount > 12) {
      warnings.push({
        severity: 'warning',
        message: `Your build requires approximately ${pinCount} pins, but Pro Micro/Elite-C only have 12 usable pins. Consider using an RP2040-based controller instead.`,
        affectedChoices: ['controller', 'features'],
      })
    }
  }

  // Check trackball complexity warnings
  if (choices.features.trackball) {
    if (choices.buildMethod !== 'custom-pcb') {
      warnings.push({
        severity: 'warning',
        message:
          'Trackball integration is extremely complex with handwired builds. A custom PCB is highly recommended.',
        affectedChoices: ['features', 'buildMethod'],
      })
    }

    if (choices.controller === 'pro-micro') {
      warnings.push({
        severity: 'warning',
        message:
          'Trackball requires 6 pins for SPI communication. Pro Micro may not have enough pins for a full matrix.',
        affectedChoices: ['features', 'controller'],
      })
    }
  }

  // Check 3D printing requirement
  if (choices.layout.formFactor === 'ergonomic-3d' && choices.buildMethod === 'pcb-kit') {
    warnings.push({
      severity: 'info',
      message:
        'Ergonomic 3D layouts typically require custom 3D printed cases. PCB kits may not include compatible cases.',
      affectedChoices: ['layout', 'buildMethod'],
    })
  }

  // Check switch compatibility with layout
  if (choices.switchType === 'choc-v1' && choices.layout.formFactor === 'ergonomic-3d') {
    warnings.push({
      severity: 'info',
      message:
        'Choc v1 switches work great with 3D printed cases but require careful case design for the lower profile.',
      affectedChoices: ['switchType', 'layout'],
    })
  }

  // Check hot-swap with handwired
  if (choices.features.hotswap && choices.buildMethod === 'handwired') {
    warnings.push({
      severity: 'warning',
      message:
        'Hot-swap sockets are difficult to integrate into handwired builds. Consider a PCB-based build instead.',
      affectedChoices: ['features', 'buildMethod'],
    })
  }

  // Check RGB complexity
  if (choices.features.rgb && choices.controller === 'pro-micro') {
    const keyCount = choices.layout.keyCount
    if (keyCount > 40) {
      warnings.push({
        severity: 'warning',
        message:
          'RGB LEDs for 40+ keys can be complex to wire and may cause power issues. Consider per-key vs underglow.',
        affectedChoices: ['features', 'controller'],
      })
    }
  }

  return warnings
}

function calculatePinRequirements(choices: UserChoices): number {
  let pins = 0

  // Matrix pins (rough estimate based on key count)
  // Typical split keyboard uses ~7 rows + 6 columns per half
  const keyCount = choices.layout.keyCount / 2 // per half
  const rows = Math.ceil(Math.sqrt(keyCount))
  const cols = Math.ceil(keyCount / rows)
  pins += rows + cols

  // Feature pins
  if (choices.features.rgb) pins += 1 // Single data pin for WS2812B chain
  if (choices.features.oled) pins += 2 // I2C (SDA, SCL)
  if (choices.features.encoder) pins += 3 // 2 pins for encoder + 1 for button
  if (choices.features.trackball) pins += 6 // SPI (MISO, MOSI, SCK, CS) + motion pin + possibly reset

  return pins
}

export function getCompatibilityStatus(
  warnings: CompatibilityWarning[]
): 'ok' | 'warnings' | 'errors' {
  if (warnings.some((w) => w.severity === 'error')) return 'errors'
  if (warnings.some((w) => w.severity === 'warning')) return 'warnings'
  return 'ok'
}
