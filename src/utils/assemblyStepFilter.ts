import { type UserChoices } from '../contexts/UserChoicesContext'
import { type AssemblyPhase, type AssemblyStep, StepRequirements } from '../types/assembly'

/**
 * Filters assembly steps based on user's build choices
 * Returns only phases and steps relevant to the user's configuration
 */
export function getRelevantSteps(
  choices: UserChoices,
  allPhases: AssemblyPhase[]
): AssemblyPhase[] {
  // Filter each phase's steps
  const filteredPhases = allPhases
    .map((phase) => ({
      ...phase,
      steps: phase.steps
        .filter((step) => isStepRelevant(step, choices))
        .map((step) => applyStepVariations(step, choices)),
    }))
    .filter((phase) => phase.steps.length > 0) // Remove empty phases

  return filteredPhases
}

/**
 * Checks if a step should be shown based on user's choices
 */
function isStepRelevant(step: AssemblyStep, choices: UserChoices): boolean {
  const req = step.requirements

  // No requirements means always show
  if (!req) return true

  // Check build method
  if (req.buildMethod !== null && req.buildMethod !== undefined) {
    if (!choices.buildMethod || !req.buildMethod.includes(choices.buildMethod)) {
      return false
    }
  }

  // Check layout requirements
  if (req.layout !== null && req.layout !== undefined) {
    if (req.layout.formFactor) {
      if (
        !choices.layout.formFactor ||
        !req.layout.formFactor.includes(choices.layout.formFactor)
      ) {
        return false
      }
    }
  }

  // Check controller
  if (req.controller !== null && req.controller !== undefined) {
    if (!choices.controller || !req.controller.includes(choices.controller)) {
      return false
    }
  }

  // Check firmware
  if (req.firmware !== null && req.firmware !== undefined) {
    if (!choices.firmware || !req.firmware.includes(choices.firmware)) {
      return false
    }
  }

  // Check connectivity
  if (req.connectivity !== null && req.connectivity !== undefined) {
    if (!choices.connectivity || !req.connectivity.includes(choices.connectivity)) {
      return false
    }
  }

  // Check switch type
  if (req.switchType !== null && req.switchType !== undefined) {
    if (!choices.switchType || !req.switchType.includes(choices.switchType)) {
      return false
    }
  }

  // Check features
  if (req.features !== null && req.features !== undefined) {
    for (const [feature, required] of Object.entries(req.features)) {
      if (required && !choices.features[feature as keyof UserChoices['features']]) {
        return false
      }
    }
  }

  return true
}

/**
 * Applies step variations based on user's specific choices
 * Variations add additional content, warnings, or tips for specific configurations
 */
function applyStepVariations(step: AssemblyStep, choices: UserChoices): AssemblyStep {
  if (!step.variations || step.variations.length === 0) {
    return step
  }

  const enhancedStep = { ...step }

  for (const variation of step.variations) {
    if (matchesCondition(variation.condition, choices)) {
      // Add additional content
      if (variation.additionalContent) {
        enhancedStep.content += '\n\n' + variation.additionalContent
      }

      // Add variation-specific warnings
      if (variation.warnings) {
        enhancedStep.warnings = [...(enhancedStep.warnings || []), ...variation.warnings]
      }

      // Add variation-specific tips
      if (variation.tips) {
        enhancedStep.tips = [...(enhancedStep.tips || []), ...variation.tips]
      }
    }
  }

  return enhancedStep
}

/**
 * Checks if a variation condition matches the user's choices
 * Supports nested property paths like "layout.formFactor"
 */
function matchesCondition(condition: Record<string, any>, choices: UserChoices): boolean {
  for (const [path, expectedValue] of Object.entries(condition)) {
    const actualValue = getNestedValue(choices, path)

    // Handle array values (condition can match any value in array)
    if (Array.isArray(expectedValue)) {
      if (!expectedValue.includes(actualValue)) {
        return false
      }
    } else {
      if (actualValue !== expectedValue) {
        return false
      }
    }
  }
  return true
}

/**
 * Gets a nested property value from an object using dot notation
 * e.g., "layout.formFactor" -> choices.layout.formFactor
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

/**
 * Generates a hash of user choices to detect when build plan changes
 * Used for invalidating progress tracking when user modifies their build
 */
export function getBuildHash(choices: UserChoices): string {
  // Create a deterministic string representation of relevant choices
  const relevantChoices = {
    buildMethod: choices.buildMethod,
    layout: choices.layout.formFactor,
    controller: choices.controller,
    firmware: choices.firmware,
    connectivity: choices.connectivity,
    features: choices.features,
  }

  return JSON.stringify(relevantChoices)
}

/**
 * Calculates total number of steps across all phases
 */
export function getTotalSteps(phases: AssemblyPhase[]): number {
  return phases.reduce((total, phase) => total + phase.steps.length, 0)
}

/**
 * Calculates estimated total build time from phases
 */
export function getEstimatedTotalTime(phases: AssemblyPhase[]): string {
  // This is a simple implementation - could be enhanced to parse time strings
  // and provide more accurate total estimates
  const times = phases.map((p) => p.estimatedTime)
  return times.join(', ')
}
