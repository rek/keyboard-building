import { useState, useEffect } from 'react'
import { type UserChoices } from '../contexts/UserChoicesContext'
import { getBuildHash } from '../utils/assemblyStepFilter'

const STORAGE_KEY = 'assembly-progress'

interface AssemblyProgressData {
  buildHash: string
  completedSteps: string[]
  lastUpdated: string
}

export function useAssemblyProgress(choices: UserChoices) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const buildHash = getBuildHash(choices)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data: AssemblyProgressData = JSON.parse(saved)

        // Only restore progress if build plan hasn't changed
        if (data.buildHash === buildHash) {
          setCompletedSteps(data.completedSteps || [])
        } else {
          // Build plan changed - reset progress
          setCompletedSteps([])
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('Failed to load assembly progress:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [buildHash])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return

    try {
      const data: AssemblyProgressData = {
        buildHash,
        completedSteps,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save assembly progress:', error)
    }
  }, [completedSteps, buildHash, isLoaded])

  /**
   * Toggle step completion status
   */
  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    )
  }

  /**
   * Mark a step as complete
   */
  const markComplete = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]))
  }

  /**
   * Mark a step as incomplete
   */
  const markIncomplete = (stepId: string) => {
    setCompletedSteps((prev) => prev.filter((id) => id !== stepId))
  }

  /**
   * Check if a step is complete
   */
  const isComplete = (stepId: string): boolean => {
    return completedSteps.includes(stepId)
  }

  /**
   * Calculate completion percentage for a phase
   */
  const getPhaseProgress = (stepIds: string[]): number => {
    if (stepIds.length === 0) return 0
    const completedCount = stepIds.filter((id) => completedSteps.includes(id)).length
    return Math.round((completedCount / stepIds.length) * 100)
  }

  /**
   * Calculate overall progress percentage
   */
  const getOverallProgress = (totalSteps: number): number => {
    if (totalSteps === 0) return 0
    return Math.round((completedSteps.length / totalSteps) * 100)
  }

  /**
   * Reset all progress
   */
  const resetProgress = () => {
    setCompletedSteps([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * Check if a phase is complete
   */
  const isPhaseComplete = (stepIds: string[]): boolean => {
    if (stepIds.length === 0) return false
    return stepIds.every((id) => completedSteps.includes(id))
  }

  return {
    completedSteps,
    toggleStep,
    markComplete,
    markIncomplete,
    isComplete,
    getPhaseProgress,
    getOverallProgress,
    isPhaseComplete,
    resetProgress,
    isLoaded,
  }
}
