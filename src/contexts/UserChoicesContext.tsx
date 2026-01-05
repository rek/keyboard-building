import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface UserChoices {
  buildMethod: string | null
  layout: {
    formFactor: string | null
    keyCount: number
  }
  controller: string | null
  switchType: string | null
  features: {
    hotswap: boolean
    rgb: boolean
    oled: boolean
    encoder: boolean
    trackball: boolean
    wireless: boolean
  }
  connectivity: string | null
  firmware: string | null
  keycaps: string | null
}

interface UserChoicesContextType {
  choices: UserChoices
  updateChoice: <K extends keyof UserChoices>(key: K, value: UserChoices[K]) => void
  updateFeature: (feature: keyof UserChoices['features'], value: boolean) => void
  resetChoices: () => void
  isComplete: boolean
}

const defaultChoices: UserChoices = {
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
  keycaps: null,
}

const UserChoicesContext = createContext<UserChoicesContextType | undefined>(undefined)

const STORAGE_KEY = 'kb-choices'

export function UserChoicesProvider({ children }: { children: ReactNode }) {
  const [choices, setChoices] = useState<UserChoices>(defaultChoices)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          setChoices(parsed)
        }
      } catch (error) {
        console.error('Failed to load saved choices:', error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save to localStorage whenever choices change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(choices))
      } catch (error) {
        console.error('Failed to save choices:', error)
      }
    }
  }, [choices, isLoaded])

  const updateChoice = <K extends keyof UserChoices>(key: K, value: UserChoices[K]) => {
    setChoices((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateFeature = (feature: keyof UserChoices['features'], value: boolean) => {
    setChoices((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value,
      },
    }))
  }

  const resetChoices = () => {
    setChoices(defaultChoices)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Check if core choices are complete
  const isComplete =
    choices.buildMethod !== null &&
    choices.layout.formFactor !== null &&
    choices.controller !== null &&
    choices.switchType !== null &&
    choices.connectivity !== null &&
    choices.firmware !== null

  const value: UserChoicesContextType = {
    choices,
    updateChoice,
    updateFeature,
    resetChoices,
    isComplete,
  }

  return <UserChoicesContext.Provider value={value}>{children}</UserChoicesContext.Provider>
}

export function useUserChoices() {
  const context = useContext(UserChoicesContext)
  if (context === undefined) {
    throw new Error('useUserChoices must be used within a UserChoicesProvider')
  }
  return context
}
