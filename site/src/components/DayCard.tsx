import { motion, useReducedMotion } from 'framer-motion'
import type { DayPlan, BudgetTier } from '../data/travel'
import { getSlotFood, getSlotNote, getSlotMapQuery, getDayTransport } from '../data/travel'

interface DayCardProps {
  day: DayPlan
  index: number
  tier: BudgetTier
}

function parseTabelog(text: string): { name: string; score: string; reviews: string } | null {
  const match = text.match(/(.+?)\s*\((\d+\.\d+)\/([0-9,]+건[⚠️]*)\)/)
  if (!match) return null
  return { name: match[1].trim(), score: match[2], reviews: match[3] }
}

export default function DayCard({ day, index, tier }: DayCardProps) {
  const transport = getDayTransport(day, tier)
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.05 }}
      className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-border"
    >
      <div className="flex flex-col md:flex-row">
        {/* Day number */}
        <div className="flex-shrink-0 px-6 py-5 md:w-36 md:border-r md:border-border flex flex-col items-center justify-center bg-ai/[0.02]">
          <span className="font-serif text-3xl md:text-4xl font-bold text-ai">
            {day.title}
          </span>
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
              const food = getSlotFood(slot, tier)
              const note = getSlotNote(slot, tier)
              const mapQuery = getSlotMapQuery(slot, tier)
              const foodInfo = food ? parseTabelog(food) : null

              return (
                <div key={i} className="flex gap-3 text-sm">
                  {/* Time */}
                  <span className="flex-shrink-0 w-[5.5rem] text-xs text-text-light font-mono pt-0.5">
                    {slot.time}
                  </span>

                  {/* Detail */}
                  <div className="flex-1 min-w-0">
                    {slot.place && (
                      mapQuery ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
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
                          mapQuery && !slot.place ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
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
                            </a>
                          ) : (
                            <span className="text-shu">
                              {foodInfo.name}{' '}
                              <span className="inline-flex items-center gap-0.5 text-xs text-kin">
                                ★{foodInfo.score}
                                <span className="text-text-light">({foodInfo.reviews})</span>
                              </span>
                            </span>
                          )
                        ) : (
                          <span className="text-shu">{food}</span>
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
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
