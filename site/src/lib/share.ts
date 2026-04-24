import type { TripSettings } from './settings'
import type { BudgetTier } from '../data/travel'
import type { ConfirmedItinerary } from '../data/confirmed-types'
import { DEFAULT_TRIP_SETTINGS } from './settings'
import { compressItinerary, decompressItinerary } from './compress'
import { validateItinerary } from './validate'

// ─── Encode ───

export function encodeShareUrl(settings: TripSettings): string {
  const { osakaNights, usj, kyotoNights, budgetTier, foodSelections } = settings

  let hash = `t=${osakaNights},${usj ? 1 : 0},${kyotoNights},${budgetTier}`

  // Food selections: only non-default (altIndex > 0)
  const entries = Object.entries(foodSelections)
    .filter(([, v]) => v > 0)
    .map(([key, altIndex]) => {
      // key format: "dayId:slotIndex" → URL format: "dayId.slotIndex:altIndex"
      const [dayId, slotIndex] = key.split(':')
      return `${dayId}.${slotIndex}:${altIndex}`
    })

  if (entries.length > 0) {
    hash += `&s=${entries.join(',')}`
  }

  return `${window.location.origin}${window.location.pathname}#${hash}`
}

// ─── Decode ───

const VALID_TIERS: BudgetTier[] = ['low', 'mid', 'high']

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    console.warn(`[share] value ${value} out of range [${min},${max}], using default ${fallback}`)
    return fallback
  }
  return value
}

export function decodeShareUrl(hash: string): TripSettings | null {
  try {
    // Strip leading '#' if present
    const raw = hash.startsWith('#') ? hash.slice(1) : hash
    if (!raw) return null

    const params = new URLSearchParams(raw)

    // Parse trip settings (t=)
    const tParam = params.get('t')
    if (!tParam) return null

    const parts = tParam.split(',')
    const defaults = DEFAULT_TRIP_SETTINGS

    const osakaNights = parts[0] !== undefined
      ? clamp(Number(parts[0]), 1, 5, defaults.osakaNights)
      : defaults.osakaNights

    const usjRaw = parts[1] !== undefined ? Number(parts[1]) : 0
    const usj = usjRaw === 1

    const kyotoNights = parts[2] !== undefined
      ? clamp(Number(parts[2]), 0, 2, defaults.kyotoNights)
      : defaults.kyotoNights

    const tierRaw = parts[3] as BudgetTier | undefined
    const budgetTier: BudgetTier = tierRaw && VALID_TIERS.includes(tierRaw)
      ? tierRaw
      : defaults.budgetTier

    // Parse food selections (s=)
    const foodSelections: Record<string, number> = {}
    const sParam = params.get('s')
    if (sParam) {
      for (const entry of sParam.split(',')) {
        // Format: dayId.slotIndex:altIndex
        const match = entry.match(/^([A-Z]\d+)\.(\d+):(\d+)$/)
        if (!match) {
          console.warn(`[share] invalid food selection entry: ${entry}`)
          continue
        }
        const [, dayId, slotIndex, altIndex] = match
        const alt = Number(altIndex)
        if (alt < 1 || alt > 4) {
          console.warn(`[share] altIndex ${alt} out of range [1,4], skipping`)
          continue
        }
        foodSelections[`${dayId}:${slotIndex}`] = alt
      }
    }

    return { osakaNights, usj, kyotoNights, budgetTier, foodSelections }
  } catch (e) {
    console.warn('[share] failed to decode URL hash:', e)
    return null
  }
}

// ─── Confirmed Itinerary Share ───

export function encodeConfirmedUrl(data: ConfirmedItinerary): string {
  const encoded = compressItinerary(data)
  return `${window.location.origin}${window.location.pathname}#c=${encoded}`
}

export function decodeConfirmedUrl(hash: string): ConfirmedItinerary | null {
  try {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash
    if (!raw.startsWith('c=')) return null
    const encoded = raw.slice(2)
    if (!encoded) return null
    const data = decompressItinerary(encoded)
    if (!data) return null
    const result = validateItinerary(data)
    if (!result.valid) {
      console.warn('[share] confirmed URL data validation failed:', result.error)
      return null
    }
    return data
  } catch (e) {
    console.warn('[share] failed to decode confirmed URL:', e)
    return null
  }
}
