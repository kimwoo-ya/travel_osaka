import type { TimeSlot } from './travel'
import alternativesJson from './alternatives.json'

// ─── Types ───

export interface AlternativeFood {
  food: string              // "이름 (점수/리뷰건)" — parseTabelog() reusable format
  foodLow?: string
  foodHigh?: string
  note?: string
  noteLow?: string
  noteHigh?: string
  mapQuery?: string
  mapQueryLow?: string
  mapQueryHigh?: string
  category?: string         // UI badge
  tabelogUrl?: string       // reference only
}

export interface AlternativesData {
  alternatives: Record<string, AlternativeFood[]>  // key: "dayId:slotIndex"
  areaDistances: Record<string, number>            // key: "권역A-권역B", value: minutes
}

// key: "dayId:slotIndex" (e.g. "O1:4", "K2:4")
// value: 1~4 (1-based, alternatives array index+1)
// absence = default restaurant (0 is not stored)
export type FoodSelections = Record<string, number>

// ─── Data ───

const alternativesData = alternativesJson as AlternativesData
export { alternativesData }

// ─── Helpers ───

export function getSlotAlternatives(dayId: string, slotIndex: number): AlternativeFood[] {
  return alternativesData.alternatives[`${dayId}:${slotIndex}`] ?? []
}

export function hasAlternatives(dayId: string, slotIndex: number): boolean {
  return getSlotAlternatives(dayId, slotIndex).length > 0
}

export function getEffectiveFood(
  slot: TimeSlot,
  dayId: string,
  slotIndex: number,
  selections: FoodSelections
): { source: TimeSlot | AlternativeFood; isAlternative: boolean; category?: string } {
  const key = `${dayId}:${slotIndex}`
  const altIndex = selections[key]
  if (!altIndex) return { source: slot, isAlternative: false }

  const alts = getSlotAlternatives(dayId, slotIndex)
  const alt = alts[altIndex - 1]  // 1-based → 0-based
  if (!alt) return { source: slot, isAlternative: false }

  return { source: alt, isAlternative: true, category: alt.category }
}
