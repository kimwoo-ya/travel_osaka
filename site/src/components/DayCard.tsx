import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { DayPlan, BudgetTier, TimeSlot } from '../data/travel'
import { getSlotFood, getSlotNote, getSlotMapQuery, getDayTransport } from '../data/travel'
import { getEffectiveFood, hasAlternatives, getSlotAlternatives } from '../data/alternatives'
import type { AlternativeFood } from '../data/alternatives'
import { useTheme } from '../contexts/ThemeContext'
import { useTripContext } from '../contexts/TripContext'

interface DayCardProps {
  day: DayPlan
  index: number
  tier: BudgetTier
}

function parseTabelog(text: string): { name: string; score: string; reviews: string; category?: string } | null {
  const match = text.match(/(.+?)\s*\((\d+\.\d+)\/([0-9,]+건[⚠️]*)\)(?:\s*\[(.+?)\])?/)
  if (!match) return null
  return { name: match[1].trim(), score: match[2], reviews: match[3], category: match[4] }
}

export default function DayCard({ day, index, tier }: DayCardProps) {
  const { theme } = useTheme()
  const { foodSelections, selectAlternative, resetSelection } = useTripContext()
  const isWafu = theme === 'wafu'
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const transport = getDayTransport(day, tier)
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : (isWafu ? { scaleY: 0, opacity: 0 } : { opacity: 0, y: 30 })}
      whileInView={isWafu ? { scaleY: 1, opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={reducedMotion ? { duration: 0 } : (isWafu
        ? { scaleY: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }, opacity: { duration: 0.3, delay: index * 0.08 } }
        : { duration: 0.45, delay: index * 0.05 }
      )}
      style={isWafu ? { transformOrigin: 'top center' } : undefined}
      className={`bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-border ${isWafu ? 'wafu-card wafu-shimmer' : ''}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Day number */}
        <div className="flex-shrink-0 px-6 py-5 md:w-36 md:border-r md:border-border flex flex-col items-center justify-center bg-ai/[0.02]">
          {isWafu ? (
            <span className="wafu-stamp">{day.title}</span>
          ) : (
            <span className="font-serif text-3xl md:text-4xl font-bold text-ai">
              {day.title}
            </span>
          )}
          <span className="text-xs text-text-light mt-1">{day.subtitle}</span>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 md:px-6 md:py-5">
          <div className="mb-3">
            <p className="text-sm text-ai font-medium">{day.theme}</p>
            <p className="text-xs text-text-light mt-0.5">
              {day.area} · {transport}
            </p>
          </div>

          {/* Slots */}
          <div className="space-y-2.5">
            {day.slots.map((slot, i) => {
              const { source, isAlternative, category } = getEffectiveFood(slot, day.id, i, foodSelections)
              const effectiveSlot = source as TimeSlot
              const food = getSlotFood(effectiveSlot, tier)
              const note = getSlotNote(effectiveSlot, tier)
              const placeMapQuery = getSlotMapQuery(slot, tier)
              const foodMapQuery = getSlotMapQuery(effectiveSlot, tier)
              const foodInfo = food ? parseTabelog(food) : null
              const slotHasAlts = hasAlternatives(day.id, i)
              const accordionKey = `${day.id}:${i}`
              const isOpen = openAccordion === accordionKey
              const selectionKey = `${day.id}:${i}`
              const currentSelection = foodSelections[selectionKey] ?? 0

              return (
                <div key={i}>
                  <div className="flex gap-3 text-sm">
                    {/* Time */}
                    <span className="flex-shrink-0 w-[5.5rem] text-xs text-text-light font-mono pt-0.5">
                      {slot.time}
                    </span>

                    {/* Detail */}
                    <div className="flex-1 min-w-0">
                      {slot.place && (
                        placeMapQuery ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeMapQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ai font-medium hover:text-shu transition-colors underline decoration-border hover:decoration-shu"
                          >
                            {slot.place}
                            <span className="inline-block ml-1 text-xs opacity-40">↗</span>
                          </a>
                        ) : (
                          <span className="text-ai font-medium">{slot.place}</span>
                        )
                      )}
                      {food && (
                        <>
                          {slot.place && <span className="text-text-light mx-1">·</span>}
                          {foodInfo ? (
                            foodMapQuery ? (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(foodMapQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-shu hover:text-shu/70 transition-colors underline decoration-border hover:decoration-shu"
                              >
                                {foodInfo.name}
                                <span className="inline-block ml-0.5 text-xs opacity-40">↗</span>
                                {' '}
                                <span className="inline-flex items-center gap-0.5 text-xs text-kin">
                                  ★{foodInfo.score}
                                  <span className="text-text-light">({foodInfo.reviews})</span>
                                </span>
                                {foodInfo.category && (
                                  <span className="ml-1 text-[10px] text-text-light">[{foodInfo.category}]</span>
                                )}
                              </a>
                            ) : (
                              <span className="text-shu">
                                {foodInfo.name}{' '}
                                <span className="inline-flex items-center gap-0.5 text-xs text-kin">
                                  ★{foodInfo.score}
                                  <span className="text-text-light">({foodInfo.reviews})</span>
                                </span>
                                {foodInfo.category && (
                                  <span className="ml-1 text-[10px] text-text-light">[{foodInfo.category}]</span>
                                )}
                              </span>
                            )
                          ) : (
                            <span className="text-shu">{food}</span>
                          )}
                          {isAlternative && category && (
                            <span className="inline-flex items-center ml-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-shu/10 text-shu">
                              {category}
                            </span>
                          )}
                          {slotHasAlts && (
                            <button
                              type="button"
                              onClick={() => setOpenAccordion(isOpen ? null : accordionKey)}
                              aria-expanded={isOpen}
                              aria-controls={`alt-panel-${accordionKey}`}
                              aria-label={isOpen ? '대안 목록 닫기' : '대안 목록 열기'}
                              className="relative inline-flex items-center gap-0.5 ml-1.5 px-1.5 py-0.5 text-[11px] font-medium rounded-full transition-colors bg-shu/10 text-shu hover:bg-shu/20 focus-visible:outline-2 focus-visible:outline-shu before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']"
                            >
                              <span aria-hidden="true">다른 식당</span>
                              <span aria-hidden="true" className={`inline-block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                            </button>
                          )}
                        </>
                      )}
                      {note && (
                        <span className="block text-xs text-text-light mt-0.5">
                          {note}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Alternatives accordion panel */}
                  {slotHasAlts && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`alt-panel-${accordionKey}`}
                          role="region"
                          aria-label={`${slot.time} 슬롯 대안 식당 목록`}
                          initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden ml-[5.5rem] md:ml-[6.75rem]"
                        >
                          <div className={`mt-1.5 mb-1 rounded-lg border border-border bg-card-hover/50 ${isWafu ? 'border-wafu-gold-border' : ''}`}>
                            {/* Reset to original */}
                            {currentSelection > 0 && (
                              <button
                                type="button"
                                onClick={() => resetSelection(day.id, i)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-light hover:text-ai hover:bg-card transition-colors min-h-[44px] border-b border-border"
                              >
                                <span aria-hidden="true">↩</span>
                                <span>원래 추천으로 되돌리기</span>
                              </button>
                            )}
                            {/* Alternative items */}
                            {getSlotAlternatives(day.id, i).map((alt: AlternativeFood, altIdx: number) => {
                              const altNum = altIdx + 1
                              const isSelected = currentSelection === altNum
                              const altFoodInfo = parseTabelog(alt.food)
                              return (
                                <button
                                  key={altIdx}
                                  type="button"
                                  onClick={() => selectAlternative(day.id, i, altNum)}
                                  aria-pressed={isSelected}
                                  className={`w-full flex items-start gap-2 px-3 py-2 text-left text-xs transition-colors min-h-[44px] ${
                                    isSelected
                                      ? 'bg-shu/8 text-shu'
                                      : 'text-text hover:bg-card hover:text-ai'
                                  } ${altIdx < getSlotAlternatives(day.id, i).length - 1 ? 'border-b border-border/50' : ''}`}
                                >
                                  <span className="flex-1 min-w-0">
                                    <span className="flex items-center gap-1.5 flex-wrap">
                                      {altFoodInfo ? (
                                        <>
                                          <span className="font-medium">{altFoodInfo.name}</span>
                                          <span className="inline-flex items-center gap-0.5 text-kin">
                                            ★{altFoodInfo.score}
                                            <span className="text-text-light">({altFoodInfo.reviews})</span>
                                          </span>
                                        </>
                                      ) : (
                                        <span className="font-medium">{alt.food}</span>
                                      )}
                                      {alt.category && (
                                        <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                                          isSelected ? 'bg-shu/15 text-shu' : 'bg-ai/5 text-text-light'
                                        }`}>
                                          {alt.category}
                                        </span>
                                      )}
                                    </span>
                                    {alt.note && (
                                      <span className="block text-text-light mt-0.5">{alt.note}</span>
                                    )}
                                  </span>
                                  {isSelected && (
                                    <span className="flex-shrink-0 text-shu mt-0.5" aria-label="선택됨">✓</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
