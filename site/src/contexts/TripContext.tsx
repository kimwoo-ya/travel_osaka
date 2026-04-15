import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { BudgetTier } from '../data/travel'
import type { FoodSelections } from '../data/alternatives'
import { loadTripSettings, saveTripSettings, clearTripSettings, DEFAULT_TRIP_SETTINGS } from '../lib/settings'
import { decodeShareUrl } from '../lib/share'

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
  const [osakaNights, setOsakaNights] = useState<number>(() => loadTripSettings().osakaNights)
  const [usj, setUsj] = useState<boolean>(() => loadTripSettings().usj)
  const [kyotoNights, setKyotoNights] = useState<number>(() => loadTripSettings().kyotoNights)
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(() => loadTripSettings().budgetTier)
  const [foodSelections, setFoodSelections] = useState<FoodSelections>(() => loadTripSettings().foodSelections)

  // URL hash 초기화: hash > localStorage > 기본값
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const fromUrl = decodeShareUrl(hash)
    if (!fromUrl) return

    setOsakaNights(fromUrl.osakaNights)
    setUsj(fromUrl.usj)
    setKyotoNights(fromUrl.kyotoNights)
    setBudgetTier(fromUrl.budgetTier)
    setFoodSelections(fromUrl.foodSelections)
    saveTripSettings(fromUrl)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
