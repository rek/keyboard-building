import { type UserChoices } from '../contexts/UserChoicesContext'
import { type CostBreakdown } from './costCalculator'
import { type Currency } from '../contexts/CurrencyContext'

export interface BuildPlanExport {
  choices: UserChoices
  estimate: {
    breakdown: CostBreakdown
    total: number
    complexity: number
    buildTimeHours: number
  }
  currency: Currency
  exportedAt: string
}

export function exportAsJSON(
  choices: UserChoices,
  breakdown: CostBreakdown,
  total: number,
  complexity: number,
  buildTimeHours: number,
  currency: Currency
): void {
  const buildPlan: BuildPlanExport = {
    choices,
    estimate: {
      breakdown,
      total,
      complexity,
      buildTimeHours,
    },
    currency,
    exportedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(buildPlan, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `keyboard-build-plan-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAsText(
  choices: UserChoices,
  breakdown: CostBreakdown,
  total: number,
  complexity: number,
  buildTimeHours: number,
  currency: Currency,
  formatCurrency: (amount: number) => string
): void {
  const lines: string[] = []

  // Header
  lines.push('='.repeat(60))
  lines.push('SPLIT KEYBOARD BUILD PLAN')
  lines.push('='.repeat(60))
  lines.push('')
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push(`Currency: ${currency}`)
  lines.push('')

  // Build Summary
  lines.push('BUILD SUMMARY')
  lines.push('-'.repeat(60))
  lines.push(`Total Estimated Cost: ${formatCurrency(total)}`)
  lines.push(`Complexity Score: ${complexity}/10`)
  lines.push(`Estimated Build Time: ${buildTimeHours} hours`)
  lines.push('')

  // Core Choices
  lines.push('CORE DECISIONS')
  lines.push('-'.repeat(60))

  if (choices.buildMethod) {
    lines.push(`Build Method: ${formatId(choices.buildMethod)}`)
  }

  if (choices.layout.formFactor) {
    lines.push(`Layout: ${formatId(choices.layout.formFactor)}`)
    lines.push(`  Key Count: ${choices.layout.keyCount} keys`)
  }

  if (choices.controller) {
    lines.push(`Controller: ${formatId(choices.controller)}`)
  }

  if (choices.switchType) {
    lines.push(`Switches: ${formatId(choices.switchType)}`)
  }

  if (choices.connectivity) {
    lines.push(`Connectivity: ${formatId(choices.connectivity)}`)
  }

  if (choices.firmware) {
    lines.push(`Firmware: ${formatId(choices.firmware)}`)
  }

  lines.push('')

  // Features
  const enabledFeatures = Object.entries(choices.features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => formatId(feature))

  if (enabledFeatures.length > 0) {
    lines.push('FEATURES')
    lines.push('-'.repeat(60))
    enabledFeatures.forEach((feature) => {
      lines.push(`  ✓ ${feature}`)
    })
    lines.push('')
  }

  // Cost Breakdown
  lines.push('COST BREAKDOWN')
  lines.push('-'.repeat(60))

  const costItems = [
    { label: 'Controllers', amount: breakdown.controller },
    { label: 'Switches', amount: breakdown.switches },
    { label: 'Keycaps', amount: breakdown.keycaps },
    { label: 'PCB', amount: breakdown.pcb },
    { label: 'Case', amount: breakdown.case },
    { label: 'Hardware', amount: breakdown.hardware },
    { label: 'Features', amount: breakdown.features },
    { label: 'Connectivity', amount: breakdown.connectivity },
    { label: 'Shipping', amount: breakdown.shipping },
  ].filter((item) => item.amount > 0)

  costItems.forEach((item) => {
    lines.push(`  ${item.label.padEnd(20)} ${formatCurrency(item.amount)}`)
  })

  lines.push('  ' + '-'.repeat(30))
  lines.push(`  ${'TOTAL'.padEnd(20)} ${formatCurrency(total)}`)
  lines.push('')

  // Build Checklist
  lines.push('BUILD CHECKLIST')
  lines.push('-'.repeat(60))
  lines.push('□ Order all components')
  lines.push('□ Gather required tools')

  if (choices.buildMethod === 'custom-pcb') {
    lines.push('□ Design PCB in KiCad')
    lines.push('□ Export Gerber files')
    lines.push('□ Order PCB from manufacturer (2-4 week lead time)')
  }

  if (choices.layout.formFactor === 'ergonomic-3d') {
    lines.push('□ 3D print case (or order from service)')
  }

  lines.push('□ Solder components')

  if (choices.firmware === 'qmk') {
    lines.push('□ Set up QMK build environment')
    lines.push('□ Compile and flash firmware')
  } else if (choices.firmware === 'vial') {
    lines.push('□ Download Vial configurator')
    lines.push('□ Flash Vial firmware')
  } else if (choices.firmware === 'kmk') {
    lines.push('□ Install CircuitPython on RP2040')
    lines.push('□ Copy KMK files to board')
  } else if (choices.firmware === 'zmk') {
    lines.push('□ Set up ZMK GitHub repository')
    lines.push('□ Configure keymap')
    lines.push('□ Download and flash firmware')
  }

  lines.push('□ Test all keys')
  lines.push('□ Install keycaps')
  lines.push('□ Enjoy your custom keyboard!')
  lines.push('')

  // Footer
  lines.push('='.repeat(60))
  lines.push('Built with Split Keyboard Builder Guide')
  lines.push('https://github.com/yourusername/split-keyboard-guide')
  lines.push('='.repeat(60))

  const text = lines.join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `keyboard-build-plan-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function formatId(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
