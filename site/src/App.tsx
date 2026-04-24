import { useMemo } from 'react'
import Hero from './components/Hero'
import ControlBar from './components/ControlBar'
import DayCard from './components/DayCard'
import ConfirmedDayCard from './components/ConfirmedDayCard'
import BudgetSection from './components/BudgetSection'
import Footer from './components/Footer'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { TripProvider, useTripContext } from './contexts/TripContext'
import { osakaDays, usjDay, kyotoDays } from './data/travel'
import type { DayPlan } from './data/travel'

function AppContent() {
  const { mode, confirmedData, osakaNights, usj, kyotoNights, budgetTier } = useTripContext()

  const days: DayPlan[] = useMemo(() => {
    const osakaCount = osakaNights + 1
    const osakaSlice = osakaDays.slice(0, Math.min(osakaCount, osakaDays.length))

    const middle: DayPlan[] = []
    if (usj) middle.push(usjDay)
    if (kyotoNights > 0) {
      const kyotoCount = kyotoNights + 1
      for (let i = 0; i < kyotoCount && i < kyotoDays.length; i++) {
        middle.push(kyotoDays[i])
      }
    }

    if (osakaSlice.length <= 1) {
      return [...osakaSlice, ...middle]
    }

    const first = osakaSlice[0]
    const last = osakaSlice[osakaSlice.length - 1]
    const rest = osakaSlice.slice(1, -1)

    return [first, ...rest, ...middle, last]
  }, [osakaNights, usj, kyotoNights])

  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-washi bg-seigaiha">
      {theme === 'wafu' && (
        <>
          <div className="wafu-sakura" aria-hidden="true" />
          <div className="wafu-sakura" aria-hidden="true" />
          <div className="wafu-sakura" aria-hidden="true" />
        </>
      )}

      <Hero />

      <ControlBar />

      <main>
        {mode === 'confirmed' && confirmedData ? (
          <section className="py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-5">
              {confirmedData.days.map((day, i) => (
                <ConfirmedDayCard key={day.date} day={day} index={i} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="py-10 px-4">
              <div className="max-w-3xl mx-auto space-y-5">
                {days.map((day, i) => (
                  <DayCard key={day.id} day={day} index={i} tier={budgetTier} />
                ))}
              </div>
            </section>

            <BudgetSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </ThemeProvider>
  )
}

export default App
