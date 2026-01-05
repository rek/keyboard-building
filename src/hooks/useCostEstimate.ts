import { useMemo } from 'react'
import { useUserChoices } from '../contexts/UserChoicesContext'
import {
  calculateCost,
  calculateComplexity,
  estimateBuildTime,
  type CostEstimate,
} from '../utils/costCalculator'

export interface BuildEstimate extends CostEstimate {
  complexity: number
  buildTimeHours: number
}

export function useCostEstimate(): BuildEstimate {
  const { choices } = useUserChoices()

  const estimate = useMemo(() => {
    const cost = calculateCost(choices)
    const complexity = calculateComplexity(choices)
    const buildTimeHours = estimateBuildTime(choices)

    return {
      ...cost,
      complexity,
      buildTimeHours,
    }
  }, [choices])

  return estimate
}
