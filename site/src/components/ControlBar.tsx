import type { BudgetTier } from '../data/travel'
import { dailyTotal } from '../data/travel'

interface ControlBarProps {
  osakaNights: number
  setOsakaNights: (n: number) => void
  usj: boolean
  setUsj: (b: boolean) => void
  kyotoNights: number
  setKyotoNights: (n: number) => void
  budgetTier: BudgetTier
  setBudgetTier: (t: BudgetTier) => void
}

const kyotoOptions = [
  { value: 0, label: '없음' },
  { value: 1, label: '1박2일' },
  { value: 2, label: '2박3일' },
] as const

const tierOptions: { value: BudgetTier; label: string; color: string; daily: number }[] = [
  { value: 'low', label: '저가', color: 'bg-green-600', daily: dailyTotal.low },
  { value: 'mid', label: '중간', color: 'bg-ai', daily: dailyTotal.mid },
  { value: 'high', label: '럭셔리', color: 'bg-kin', daily: dailyTotal.high },
]

function formatMan(won: number): string {
  return `${Math.round(won / 10000)}만`
}

export default function ControlBar({
  osakaNights,
  setOsakaNights,
  usj,
  setUsj,
  kyotoNights,
  setKyotoNights,
  budgetTier,
  setBudgetTier,
}: ControlBarProps) {
  const totalNights = osakaNights + (usj ? 1 : 0) + kyotoNights
  const totalDays = totalNights + 1
  const activeTier = tierOptions.find((t) => t.value === budgetTier)!

  return (
    <div className="sticky top-0 z-50 bg-washi/85 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-3 py-2 md:px-4 md:py-3">
        {/* 한 줄로 컴팩트하게 */}
        <div className="flex items-center gap-2 md:gap-5 flex-wrap">
          {/* 오사카 슬라이더 — 컴팩트 */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] md:text-xs text-text-light whitespace-nowrap">오사카</span>
            <input
              type="range"
              min={1}
              max={5}
              value={osakaNights}
              onChange={(e) => setOsakaNights(Number(e.target.value))}
              className="w-16 md:w-24 h-1 accent-ai rounded-full appearance-none bg-border cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ai [&::-webkit-slider-thumb]:shadow"
            />
            <span className="text-xs font-medium text-ai w-6 text-right">{osakaNights}박</span>
          </div>

          {/* 구분선 */}
          <div className="hidden md:block w-px h-5 bg-border" />

          {/* USJ 토글 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] md:text-xs text-text-light">USJ</span>
            <button
              onClick={() => setUsj(!usj)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                usj ? 'bg-shu' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  usj ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 구분선 */}
          <div className="hidden md:block w-px h-5 bg-border" />

          {/* 교토 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] md:text-xs text-text-light">교토</span>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {kyotoOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKyotoNights(opt.value)}
                  className={`px-2 py-0.5 text-[10px] md:text-xs font-medium transition-colors ${
                    kyotoNights === opt.value
                      ? 'bg-ai text-white'
                      : 'bg-white text-text hover:bg-card-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="hidden md:block w-px h-5 bg-border" />

          {/* 예산 티어 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] md:text-xs text-text-light">예산</span>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {tierOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBudgetTier(opt.value)}
                  className={`px-2 py-0.5 text-[10px] md:text-xs font-medium transition-colors ${
                    budgetTier === opt.value
                      ? `${opt.color} text-white`
                      : 'bg-white text-text hover:bg-card-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 총 일정 + 일별 예산 */}
          <div className="ml-auto text-right flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm font-medium text-ai">
              <span className="font-bold text-shu">{totalNights}박{totalDays}일</span>
            </span>
            <span className="text-[10px] md:text-xs text-text-light">
              일 ₩{formatMan(activeTier.daily)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
