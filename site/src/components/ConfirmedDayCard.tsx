import { motion, useReducedMotion } from 'framer-motion'
import type { ConfirmedDay, ConfirmedSlot } from '../data/confirmed-types'
import { useTheme } from '../contexts/ThemeContext'

interface ConfirmedDayCardProps {
  day: ConfirmedDay
  index: number
}

function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dow = days[date.getDay()]
  return `${m}/${d} (${dow})`
}

function SlotRow({ slot }: { slot: ConfirmedSlot }) {
  const r = slot.restaurant
  return (
    <div className="flex gap-3 py-2.5 border-b border-border/50 last:border-b-0">
      <span className="text-xs text-text-light font-mono w-24 shrink-0 pt-0.5">{slot.time}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-text">{slot.place}</span>
          {slot.category && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-ai/10 text-ai">{slot.category}</span>
          )}
          {slot.mapUrl && (
            <a href={slot.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ai hover:underline" aria-label={`${slot.place} 지도 보기`}>
              📍
            </a>
          )}
        </div>
        {r && (
          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-light">
            {r.tabelog !== undefined && (
              <span className="font-medium text-shu">★{r.tabelog.toFixed(2)}</span>
            )}
            {r.reviews !== undefined && (
              <span>({r.reviews.toLocaleString()}건)</span>
            )}
            {r.price && <span>{r.price}</span>}
          </div>
        )}
        {slot.note && <p className="text-xs text-text-light mt-0.5">{slot.note}</p>}
      </div>
    </div>
  )
}

export default function ConfirmedDayCard({ day, index }: ConfirmedDayCardProps) {
  const { theme } = useTheme()
  const isWafu = theme === 'wafu'
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
        {/* Day number + date */}
        <div className="flex-shrink-0 px-6 py-5 md:w-36 md:border-r md:border-border flex flex-col items-center justify-center bg-ai/[0.02]">
          {isWafu ? (
            <span className="wafu-stamp">{day.title.split(' ')[0] || `Day ${day.dayNumber}`}</span>
          ) : (
            <span className="font-serif text-3xl md:text-4xl font-bold text-ai">
              Day {day.dayNumber}
            </span>
          )}
          <span className="text-sm text-text-light mt-1">{formatDateWithDay(day.date)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 md:px-6">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-base font-bold text-text">{day.title}</h3>
            {day.route && (
              <p className="text-xs text-text-light mt-0.5">{day.route}</p>
            )}
            {day.transport && (
              <p className="text-xs text-ai mt-0.5">🚃 {day.transport}</p>
            )}
          </div>

          {/* Slots */}
          <div className="divide-y-0">
            {day.slots.map((slot, i) => (
              <SlotRow key={i} slot={slot} />
            ))}
          </div>

          {/* Accommodation */}
          {day.accommodation && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-light">🏨</span>
                <span className="font-medium text-text">{day.accommodation.name}</span>
                {day.accommodation.checkIn && (
                  <span className="text-xs text-text-light">체크인 {day.accommodation.checkIn}</span>
                )}
                {day.accommodation.bookingUrl && (
                  <a href={day.accommodation.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ai hover:underline">
                    예약 →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
