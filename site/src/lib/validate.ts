import type { ConfirmedItinerary } from '../data/confirmed-types'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export interface ValidationResult {
  valid: boolean
  error?: string
}

function fail(msg: string): ValidationResult {
  return { valid: false, error: msg }
}

export function validateItinerary(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') return fail('유효한 JSON 객체가 아닙니다.')

  const obj = data as Record<string, unknown>

  if (typeof obj.title !== 'string' || !obj.title) return fail('title 필드가 필요합니다.')
  if (typeof obj.startDate !== 'string' || !DATE_RE.test(obj.startDate)) return fail('startDate는 YYYY-MM-DD 형식이어야 합니다.')
  if (typeof obj.endDate !== 'string' || !DATE_RE.test(obj.endDate)) return fail('endDate는 YYYY-MM-DD 형식이어야 합니다.')
  if (!Array.isArray(obj.days) || obj.days.length === 0) return fail('days 배열이 비어있습니다.')

  for (let i = 0; i < obj.days.length; i++) {
    const day = obj.days[i] as Record<string, unknown>
    const label = `Day ${i + 1}`

    if (typeof day.date !== 'string' || !DATE_RE.test(day.date)) return fail(`${label}의 date 형식이 올바르지 않습니다.`)
    if (typeof day.dayNumber !== 'number' || !Number.isInteger(day.dayNumber) || day.dayNumber < 1) return fail(`${label}의 dayNumber는 1 이상의 정수여야 합니다.`)
    if (typeof day.title !== 'string' || !day.title) return fail(`${label}의 title이 필요합니다.`)
    if (!Array.isArray(day.slots) || day.slots.length === 0) return fail(`${label}의 slots 배열이 비어있습니다.`)

    for (let j = 0; j < day.slots.length; j++) {
      const slot = day.slots[j] as Record<string, unknown>
      if (typeof slot.time !== 'string' || !slot.time) return fail(`${label} 슬롯 ${j + 1}의 time이 필요합니다.`)
      if (typeof slot.place !== 'string' || !slot.place) return fail(`${label} 슬롯 ${j + 1}의 place가 필요합니다.`)

      if (slot.restaurant && typeof slot.restaurant === 'object') {
        const r = slot.restaurant as Record<string, unknown>
        if (r.tabelog !== undefined && (typeof r.tabelog !== 'number' || r.tabelog < 0 || r.tabelog > 5)) return fail(`${label} 슬롯 ${j + 1}의 tabelog 점수는 0~5 범위여야 합니다.`)
        if (r.reviews !== undefined && (typeof r.reviews !== 'number' || !Number.isInteger(r.reviews) || r.reviews < 0)) return fail(`${label} 슬롯 ${j + 1}의 reviews는 0 이상의 정수여야 합니다.`)
      }
    }
  }

  return { valid: true }
}

export function parseAndValidate(json: string): { data: ConfirmedItinerary | null; error?: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { data: null, error: 'JSON 파싱에 실패했습니다. 파일 형식을 확인해주세요.' }
  }

  const result = validateItinerary(parsed)
  if (!result.valid) return { data: null, error: result.error }

  return { data: parsed as ConfirmedItinerary }
}
