import type { BudgetTier } from '../data/travel'
import type { FoodSelections } from '../data/alternatives'

// ─── Types ───

export interface TripSettings {
  osakaNights: number       // 1-5
  usj: boolean
  kyotoNights: number       // 0-2
  budgetTier: BudgetTier    // 'low' | 'mid' | 'high'
  foodSelections: FoodSelections
}

interface StoredSettings extends TripSettings {
  version: number
}

// ─── Constants ───

export const DEFAULT_TRIP_SETTINGS: TripSettings = {
  osakaNights: 2,
  usj: false,
  kyotoNights: 0,
  budgetTier: 'mid',
  foodSelections: {},
}

const STORAGE_KEY = 'travel-trip-settings'
const CURRENT_VERSION = 1

// ─── Functions ───

export function saveTripSettings(settings: TripSettings): void {
  try {
    const stored: StoredSettings = { ...settings, version: CURRENT_VERSION }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // localStorage unavailable or quota exceeded
  }
}

export function loadTripSettings(): TripSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TRIP_SETTINGS
    const parsed: StoredSettings = JSON.parse(raw)
    if (parsed.version !== CURRENT_VERSION) return DEFAULT_TRIP_SETTINGS
    return {
      osakaNights: parsed.osakaNights,
      usj: parsed.usj,
      kyotoNights: parsed.kyotoNights,
      budgetTier: parsed.budgetTier,
      foodSelections: parsed.foodSelections,
    }
  } catch {
    return DEFAULT_TRIP_SETTINGS
  }
}

export function clearTripSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}
