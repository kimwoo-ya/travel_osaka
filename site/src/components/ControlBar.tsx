import { useState } from 'react'
import type { BudgetTier } from '../data/travel'
import { dailyTotal } from '../data/travel'
import { useTheme } from '../contexts/ThemeContext'
import { useTripContext } from '../contexts/TripContext'
import { encodeShareUrl } from '../lib/share'
import { encodeConfirmedUrl } from '../lib/share'
import FileUpload from './FileUpload'

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

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  return `${s.getMonth() + 1}/${s.getDate()}~${e.getMonth() + 1}/${e.getDate()}`
}

export default function ControlBar() {
  const {
    mode, setMode,
    confirmedData, clearConfirmed,
    osakaNights, setOsakaNights, usj, setUsj, kyotoNights, setKyotoNights,
    budgetTier, setBudgetTier, foodSelections, resetAll,
  } = useTripContext()
  const { theme, toggleTheme } = useTheme()
  const isWafu = theme === 'wafu'
  const [copied, setCopied] = useState(false)

  const isConfirmed = mode === 'confirmed'

  // ── Confirmed Mode ──
  if (isConfirmed && confirmedData) {
    return (
      <nav aria-label="확정 일정 컨트롤" className={`sticky top-0 z-50 bg-washi/85 backdrop-blur-md border-b border-border shadow-sm ${isWafu ? 'wafu-nav' : ''}`}>
        <div className="max-w-4xl mx-auto px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* 여행 제목 + 기간 */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold text-ai truncate">{confirmedData.title}</span>
              <span className="text-xs text-text-light whitespace-nowrap">
                {formatDateRange(confirmedData.startDate, confirmedData.endDate)}
              </span>
              <span className="text-xs font-medium text-shu whitespace-nowrap">
                {confirmedData.days.length}일
              </span>
            </div>

            {/* 우측 버튼들 */}
            <div className="flex flex-1 justify-end items-center gap-2">
              {/* 탐색 모드 전환 */}
              <button
                onClick={() => setMode('explore')}
                aria-label="탐색 모드로 전환"
                className="flex items-center justify-center h-9 px-3 rounded-lg text-xs font-medium transition-colors duration-200 bg-card text-text-light border border-border hover:bg-card-hover hover:text-ai"
              >
                탐색
              </button>

              {/* 구분선 */}
              <div className="w-px h-5 bg-border" />

              {/* 새 업로드 */}
              <FileUpload className="relative" />

              {/* 공유 */}
              <button
                onClick={() => {
                  const url = encodeConfirmedUrl(confirmedData)
                  if (url.length > 8000) {
                    alert('일정이 너무 길어 URL 공유가 불가합니다.')
                    return
                  }
                  navigator.clipboard.writeText(url).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }).catch((err) => {
                    console.warn('[share] clipboard write failed:', err)
                  })
                }}
                aria-label="공유 링크 복사"
                className={`flex items-center justify-center w-11 h-11 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                  copied
                    ? 'bg-green-600 text-white'
                    : isWafu
                      ? 'bg-card text-ai border border-border hover:bg-card-hover'
                      : 'bg-card text-text-light border border-border hover:bg-card-hover hover:text-ai'
                }`}
              >
                <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
              </button>

              {/* 삭제 */}
              <button
                onClick={clearConfirmed}
                aria-label="확정 일정 삭제"
                className={`flex items-center justify-center w-11 h-11 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                  isWafu
                    ? 'bg-card text-shu border border-border hover:bg-card-hover'
                    : 'bg-card text-text-light border border-border hover:bg-card-hover hover:text-shu'
                }`}
              >
                <span aria-hidden="true">🗑</span>
              </button>

              {/* 구분선 */}
              <div className="w-px h-5 bg-border" />

              {/* 테마 토글 */}
              <button
                role="switch"
                aria-checked={isWafu}
                aria-label="테마 전환"
                onClick={toggleTheme}
                className={`relative flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                  isWafu
                    ? 'bg-ai text-white'
                    : 'bg-card text-ai border border-border hover:bg-card-hover'
                }`}
              >
                <span className="text-base" aria-hidden="true">
                  {isWafu ? '\u26E9' : '\u{1F3D9}'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // ── Explore Mode ──
  const totalNights = osakaNights + (usj ? 1 : 0) + kyotoNights
  const totalDays = totalNights + 1
  const activeTier = tierOptions.find((t) => t.value === budgetTier)!

  return (
    <nav aria-label="여행 일정 설정" className={`sticky top-0 z-50 bg-washi/85 backdrop-blur-md border-b border-border shadow-sm ${isWafu ? 'wafu-nav' : ''}`}>
      <div className="max-w-4xl mx-auto px-3 py-2 md:px-4 md:py-3">
        {/* 한 줄로 컴팩트하게 */}
        <div className="flex items-center gap-2 md:gap-5 flex-wrap">
          {/* 오사카 슬라이더 — 컴팩트 */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-text-light whitespace-nowrap">오사카</span>
            <input
              type="range"
              min={1}
              max={5}
              value={osakaNights}
              onChange={(e) => setOsakaNights(Number(e.target.value))}
              aria-label={`오사카 숙박일수: ${osakaNights}박`}
              aria-valuetext={`${osakaNights}박`}
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
            <span className="text-xs text-text-light">USJ</span>
            <button
              role="switch"
              aria-checked={usj}
              aria-label="USJ 일정 포함"
              onClick={() => setUsj(!usj)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 before:absolute before:-inset-3 before:content-[''] ${
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
            <span className="text-xs text-text-light">교토</span>
            <div role="group" aria-label="교토 일정 선택" className="inline-flex rounded-md border border-border overflow-hidden">
              {kyotoOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKyotoNights(opt.value)}
                  aria-pressed={kyotoNights === opt.value}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
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
            <span className="text-xs text-text-light">예산</span>
            <div role="group" aria-label="예산 티어 선택" className="inline-flex rounded-md border border-border overflow-hidden">
              {tierOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBudgetTier(opt.value)}
                  aria-pressed={budgetTier === opt.value}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
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

          {/* 총 일정 + 일별 예산 + 버튼들 */}
          <div className="flex flex-1 justify-end items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm font-medium text-ai">
              <span className="font-bold text-shu">{totalNights}박{totalDays}일</span>
            </span>
            <span className="text-xs text-text-light">
              일 ₩{formatMan(activeTier.daily)}
            </span>

            {/* 구분선 */}
            <div className="w-px h-5 bg-border" />

            {/* 확정 일정 보기 / 업로드 */}
            <FileUpload className="relative" />

            {/* 공유 */}
            <button
              onClick={() => {
                const url = encodeShareUrl({ osakaNights, usj, kyotoNights, budgetTier, foodSelections })
                navigator.clipboard.writeText(url).then(() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }).catch((err) => {
                  console.warn('[share] clipboard write failed:', err)
                })
              }}
              aria-label="공유 링크 복사"
              className={`flex items-center justify-center w-11 h-11 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                copied
                  ? 'bg-green-600 text-white'
                  : isWafu
                    ? 'bg-card text-ai border border-border hover:bg-card-hover'
                    : 'bg-card text-text-light border border-border hover:bg-card-hover hover:text-ai'
              }`}
            >
              <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
            </button>

            {/* 초기화 */}
            <button
              onClick={resetAll}
              aria-label="설정 초기화"
              className={`flex items-center justify-center w-11 h-11 rounded-lg text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                isWafu
                  ? 'bg-card text-shu border border-border hover:bg-card-hover'
                  : 'bg-card text-text-light border border-border hover:bg-card-hover hover:text-shu'
              }`}
            >
              <span aria-hidden="true">↺</span>
            </button>

            {/* 구분선 */}
            <div className="w-px h-5 bg-border" />

            {/* 테마 토글 */}
            <button
              role="switch"
              aria-checked={isWafu}
              aria-label="테마 전환"
              onClick={toggleTheme}
              className={`relative flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai ${
                isWafu
                  ? 'bg-ai text-white'
                  : 'bg-card text-ai border border-border hover:bg-card-hover'
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {isWafu ? '\u26E9' : '\u{1F3D9}'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
