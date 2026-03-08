import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
}

const UserChoicesContext = createContext<UserChoicesContextType | undefined>(undefined)

const STORAGE_KEY = 'kb-choices'

const VALID_STRING_FIELDS = ['buildMethod', 'controller', 'switchType', 'connectivity', 'firmware']
const VALID_FEATURE_FIELDS = ['hotswap', 'rgb', 'oled', 'encoder', 'trackball', 'wireless']

function isValidUserChoices(data: unknown): data is Partial<UserChoices> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const d = data as Record<string, unknown>

  for (const field of VALID_STRING_FIELDS) {
    if (field in d && d[field] !== null && typeof d[field] !== 'string') return false
  }

  if ('layout' in d) {
    const layout = d.layout
    if (!layout || typeof layout !== 'object' || Array.isArray(layout)) return false
    const l = layout as Record<string, unknown>
    if ('formFactor' in l && l.formFactor !== null && typeof l.formFactor !== 'string') return false
    if ('keyCount' in l && typeof l.keyCount !== 'number') return false
  }

  if ('features' in d) {
    const features = d.features
    if (!features || typeof features !== 'object' || Array.isArray(features)) return false
    const f = features as Record<string, unknown>
    for (const field of VALID_FEATURE_FIELDS) {
      if (field in f && typeof f[field] !== 'boolean') return false
    }
  }

  return true
}

export function UserChoicesProvider({ children }: { children: ReactNode }) {
  const [choices, setChoices] = useState<UserChoices>(defaultChoices)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed: unknown = JSON.parse(saved)
          if (isValidUserChoices(parsed)) {
            setChoices({ ...defaultChoices, ...parsed })
          } else {
            console.warn('Saved choices failed validation, resetting to defaults')
            localStorage.removeItem(STORAGE_KEY)
          }
        }
      } catch (error) {
        console.error('Failed to load saved choices:', error)
        localStorage.removeItem(STORAGE_KEY)
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
