import { useState, useMemo } from 'react'
import Hero from './components/Hero'
import ControlBar from './components/ControlBar'
import DayCard from './components/DayCard'
import BudgetSection from './components/BudgetSection'
import Footer from './components/Footer'
import { osakaDays, usjDay, kyotoDays } from './data/travel'
import type { DayPlan, BudgetTier } from './data/travel'

function App() {
  const [osakaNights, setOsakaNights] = useState(2)
  const [usj, setUsj] = useState(false)
  const [kyotoNights, setKyotoNights] = useState(0)
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('mid')

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

  return (
    <div className="min-h-screen bg-washi bg-seigaiha">
      <Hero />

      <ControlBar
        osakaNights={osakaNights}
        setOsakaNights={setOsakaNights}
        usj={usj}
        setUsj={setUsj}
        kyotoNights={kyotoNights}
        setKyotoNights={setKyotoNights}
        budgetTier={budgetTier}
        setBudgetTier={setBudgetTier}
      />

      {/* Timeline */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-5">
          {days.map((day, i) => (
            <DayCard key={day.id} day={day} index={i} tier={budgetTier} />
          ))}
        </div>
      </section>

      <BudgetSection
        osakaNights={osakaNights}
        usj={usj}
        kyotoNights={kyotoNights}
        activeTier={budgetTier}
      />

      <Footer />
    </div>
  )
}

export default App
