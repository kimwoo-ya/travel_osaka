import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { BudgetTier } from '../data/travel'
import type { FoodSelections } from '../data/alternatives'
import { loadTripSettings, saveTripSettings, clearTripSettings, DEFAULT_TRIP_SETTINGS, type TripSettings } from '../lib/settings'
import { decodeShareUrl } from '../lib/share'

/** URL hash > localStorage > 기본값 순서로 초기 설정을 결정한다. (동기, 첫 렌더 전) */
function getInitialSettings(): TripSettings {
  const hash = window.location.hash
  if (hash) {
    const fromUrl = decodeShareUrl(hash)
    if (fromUrl) {
      saveTripSettings(fromUrl)
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return fromUrl
    }
  }
  return loadTripSettings()
}

interface TripContextValue {
  // Trip settings
  osakaNights: number
  setOsakaNights: (n: number) => void
  usj: boolean
  setUsj: (b: boolean) => void
  kyotoNights: number
  setKyotoNights: (n: number) => void
  budgetTier: BudgetTier
  setBudgetTier: (t: BudgetTier) => void

  // Food selections
  foodSelections: FoodSelections
  selectAlternative: (dayId: string, slotIndex: number, altIndex: number) => void
  resetSelection: (dayId: string, slotIndex: number) => void
  resetAll: () => void
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(getInitialSettings)
  const [osakaNights, setOsakaNights] = useState(initial.osakaNights)
  const [usj, setUsj] = useState(initial.usj)
  const [kyotoNights, setKyotoNights] = useState(initial.kyotoNights)
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initial.budgetTier)
  const [foodSelections, setFoodSelections] = useState<FoodSelections>(initial.foodSelections)

  // Persist to localStorage on state change
  useEffect(() => {
    saveTripSettings({ osakaNights, usj, kyotoNights, budgetTier, foodSelections })
  }, [osakaNights, usj, kyotoNights, budgetTier, foodSelections])

  const selectAlternative = useCallback((dayId: string, slotIndex: number, altIndex: number) => {
    setFoodSelections(prev => {
      const key = `${dayId}:${slotIndex}`
      if (altIndex === 0) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: altIndex }
    })
  }, [])

  const resetSelection = useCallback((dayId: string, slotIndex: number) => {
    setFoodSelections(prev => {
      const key = `${dayId}:${slotIndex}`
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    setOsakaNights(DEFAULT_TRIP_SETTINGS.osakaNights)
    setUsj(DEFAULT_TRIP_SETTINGS.usj)
    setKyotoNights(DEFAULT_TRIP_SETTINGS.kyotoNights)
    setBudgetTier(DEFAULT_TRIP_SETTINGS.budgetTier)
    setFoodSelections({})
    clearTripSettings()
  }, [])

  return (
    <TripContext.Provider value={{
      osakaNights, setOsakaNights,
      usj, setUsj,
      kyotoNights, setKyotoNights,
      budgetTier, setBudgetTier,
      foodSelections, selectAlternative, resetSelection, resetAll,
    }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTripContext must be used within TripProvider')
  return ctx
}
