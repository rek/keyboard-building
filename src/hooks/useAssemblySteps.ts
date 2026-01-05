import { useMemo } from 'react'
import { useUserChoices } from '../contexts/UserChoicesContext'
import { getRelevantSteps, getTotalSteps } from '../utils/assemblyStepFilter'
import { type AssemblyData, type AssemblyPhase } from '../types/assembly'
import assemblyData from '../data/assembly-steps.json'

export function useAssemblySteps() {
  const { choices } = useUserChoices()

  // Filter phases and steps based on user's choices
  const filteredPhases = useMemo(() => {
    const data = assemblyData as AssemblyData
    return getRelevantSteps(choices, data.phases)
  }, [choices])

  // Calculate total steps across all filtered phases
  const totalSteps = useMemo(() => {
    return getTotalSteps(filteredPhases)
  }, [filteredPhases])

  // Get troubleshooting data
  const troubleshooting = useMemo(() => {
    const data = assemblyData as AssemblyData
    return data.troubleshooting
  }, [])

  // Get phase by ID
  const getPhaseById = (phaseId: string): AssemblyPhase | undefined => {
    return filteredPhases.find((phase) => phase.id === phaseId)
  }

  // Get step IDs for a phase
  const getPhaseStepIds = (phaseId: string): string[] => {
    const phase = getPhaseById(phaseId)
    return phase ? phase.steps.map((step) => step.id) : []
  }

  return {
    phases: filteredPhases,
    totalSteps,
    totalPhases: filteredPhases.length,
    troubleshooting,
    getPhaseById,
    getPhaseStepIds,
  }
}
