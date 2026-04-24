import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { BudgetTier } from '../data/travel'
import type { FoodSelections } from '../data/alternatives'
import type { ConfirmedItinerary } from '../data/confirmed-types'
import { loadTripSettings, saveTripSettings, clearTripSettings, DEFAULT_TRIP_SETTINGS, type TripSettings } from '../lib/settings'
import { loadConfirmedItinerary, saveConfirmedItinerary, clearConfirmedItinerary } from '../lib/settings'
import { decodeShareUrl } from '../lib/share'
import { decodeConfirmedUrl } from '../lib/share'

export type AppMode = 'explore' | 'confirmed'

interface InitialState {
  mode: AppMode
  tripSettings: TripSettings
  confirmedData: ConfirmedItinerary | null
}

/** URL hash > localStorage > 기본값 순서로 초기 설정을 결정한다. (동기, 첫 렌더 전) */
function getInitialState(): InitialState {
  const hash = window.location.hash

  if (hash) {
    // 1. URL #c= → 확정 모드
    const confirmed = decodeConfirmedUrl(hash)
    if (confirmed) {
      saveConfirmedItinerary(confirmed)
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return { mode: 'confirmed', tripSettings: loadTripSettings(), confirmedData: confirmed }
    }

    // 2. URL #t= → 탐색 모드
    const fromUrl = decodeShareUrl(hash)
    if (fromUrl) {
      saveTripSettings(fromUrl)
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return { mode: 'explore', tripSettings: fromUrl, confirmedData: null }
    }
  }

  // 3. localStorage 확정 일정 → 확정 모드
  const savedConfirmed = loadConfirmedItinerary()
  if (savedConfirmed) {
    return { mode: 'confirmed', tripSettings: loadTripSettings(), confirmedData: savedConfirmed }
  }

  // 4. localStorage 탐색 설정 → 탐색 모드
  // 5. 기본값 → 탐색 모드
  return { mode: 'explore', tripSettings: loadTripSettings(), confirmedData: null }
}

interface TripContextValue {
  // Mode
  mode: AppMode
  setMode: (m: AppMode) => void

  // Confirmed itinerary
  confirmedData: ConfirmedItinerary | null
  setConfirmedData: (data: ConfirmedItinerary) => void
  clearConfirmed: () => void

  // Trip settings (explore mode)
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
  const [initial] = useState(getInitialState)
  const [mode, setMode] = useState<AppMode>(initial.mode)
  const [confirmedData, setConfirmedDataState] = useState<ConfirmedItinerary | null>(initial.confirmedData)
  const [osakaNights, setOsakaNights] = useState(initial.tripSettings.osakaNights)
  const [usj, setUsj] = useState(initial.tripSettings.usj)
  const [kyotoNights, setKyotoNights] = useState(initial.tripSettings.kyotoNights)
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initial.tripSettings.budgetTier)
  const [foodSelections, setFoodSelections] = useState<FoodSelections>(initial.tripSettings.foodSelections)

  // Persist explore settings
  useEffect(() => {
    saveTripSettings({ osakaNights, usj, kyotoNights, budgetTier, foodSelections })
  }, [osakaNights, usj, kyotoNights, budgetTier, foodSelections])

  // Persist confirmed data
  useEffect(() => {
    if (confirmedData) {
      saveConfirmedItinerary(confirmedData)
    }
  }, [confirmedData])

  const setConfirmedData = useCallback((data: ConfirmedItinerary) => {
    setConfirmedDataState(data)
    setMode('confirmed')
  }, [])

  const clearConfirmed = useCallback(() => {
    setConfirmedDataState(null)
    clearConfirmedItinerary()
    setMode('explore')
  }, [])

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
      mode, setMode,
      confirmedData, setConfirmedData, clearConfirmed,
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
