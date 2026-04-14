import { motion, useReducedMotion } from 'framer-motion'
import { calcBudget } from '../data/travel'
import type { BudgetTier } from '../data/travel'
import { useTheme } from '../contexts/ThemeContext'

interface BudgetSectionProps {
  osakaNights: number
  usj: boolean
  kyotoNights: number
  activeTier: BudgetTier
}

function formatMan(won: number): string {
  const man = Math.round(won / 10000)
  return `₩${man}만`
}

const tiers = [
  {
    key: 'low' as const,
    label: '저가',
    desc: '최대 절약',
    accent: false,
    details: [
      { icon: '🏠', label: '숙소', value: '호스텔·게스트하우스 (도미토리 or 개인실)' },
      { icon: '🍙', label: '식사', value: '편의점·규동 체인·타코야키' },
      { icon: '🚇', label: '교통', value: 'ICOCA 대중교통 (메트로·JR)' },
      { icon: '🎯', label: '관광', value: '무료 명소 중심 (도톤보리·공원·시장)' },
      { icon: '🛍', label: '쇼핑', value: '드럭스토어·100엔숍·간식류' },
    ],
  },
  {
    key: 'mid' as const,
    label: '중간',
    desc: '추천',
    accent: true,
    details: [
      { icon: '🏨', label: '숙소', value: '비즈니스호텔·3성급 (더블/트윈)' },
      { icon: '🍽', label: '식사', value: 'tabelog 맛집 (오코노미야키·쿠시카츠·라멘)' },
      { icon: '🚇', label: '교통', value: '주유패스 + 가끔 택시' },
      { icon: '🎫', label: '관광', value: '전망대·수족관·체험 (주유패스 무료 입장)' },
      { icon: '🛍', label: '쇼핑', value: '의류·화장품·기념품' },
    ],
  },
  {
    key: 'high' as const,
    label: '럭셔리',
    desc: '프리미엄',
    accent: false,
    details: [
      { icon: '🏩', label: '숙소', value: '4~5성급 호텔 (콘래드·인터컨티넨탈)' },
      { icon: '🥩', label: '식사', value: '와규 야키니쿠·오마카세·호텔 조식' },
      { icon: '🚕', label: '교통', value: '택시 자유 이용' },
      { icon: '🎢', label: '관광', value: 'USJ 익스프레스 패스·프라이빗 체험' },
      { icon: '🛍', label: '쇼핑', value: '브랜드 쇼핑·백화점·고급 기념품' },
    ],
  },
]

export default function BudgetSection({ osakaNights, usj, kyotoNights, activeTier }: BudgetSectionProps) {
  const { theme } = useTheme()
  const isWafu = theme === 'wafu'
  const budget = calcBudget(osakaNights, usj, kyotoNights)
  const reducedMotion = useReducedMotion()

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className={`font-serif text-2xl md:text-3xl font-bold text-ai text-center mb-2 ${isWafu ? 'wafu-heading' : ''}`}>
          예상 예산
        </h2>
        <p className="text-center text-sm text-text-light mb-8">
          항공권 제외 · 현지 비용 기준 · 2인 합산 · {budget.totalNights}박{budget.totalDays}일
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.key}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-md ${isWafu ? 'wafu-shimmer' : ''} ${
                activeTier === tier.key
                  ? 'bg-ai text-white border-ai shadow-md md:scale-[1.03] ring-2 ring-shu ring-offset-2'
                  : 'bg-card border-border shadow-sm opacity-70'
              }`}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center">
                <p
                  className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                    activeTier === tier.key ? 'text-white/70' : 'text-text-light'
                  }`}
                >
                  {tier.label}
                </p>
                <p
                  className={`text-3xl font-bold font-serif mt-2 ${
                    activeTier === tier.key ? 'text-white' : 'text-ai'
                  }`}
                >
                  {formatMan(budget[tier.key])}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    activeTier === tier.key ? 'text-white/50' : 'text-text-light'
                  }`}
                >
                  {tier.desc}
                </p>
              </div>

              {/* Divider */}
              <div className={`mx-6 border-t ${activeTier === tier.key ? 'border-white/20' : 'border-border'}`} />

              {/* Details */}
              <div className="px-6 py-4 space-y-2.5">
                {tier.details.map((d) => (
                  <div key={d.label} className="flex items-start gap-2 text-xs">
                    <span className="flex-shrink-0 text-sm">{d.icon}</span>
                    <div>
                      <span className={`font-medium ${activeTier === tier.key ? 'text-white/80' : 'text-text'}`}>
                        {d.label}
                      </span>
                      <span className={`ml-1 ${activeTier === tier.key ? 'text-white/60' : 'text-text-light'}`}>
                        {d.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 절약 팁 */}
        <div className="mt-8 bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-medium text-ai mb-3">💡 절약 팁</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-text-light">
            <p>• <strong className="text-text">주유패스</strong> 1일권 ¥3,500 → 교통+입장료 ¥5,000+ 절약</p>
            <p>• <strong className="text-text">편의점 아침</strong> ¥500 이내 (호텔 조식 대비 ¥1,500+ 절약)</p>
            <p>• <strong className="text-text">면세 쇼핑</strong> ¥5,000 이상 구매 시 소비세 10% 면세</p>
            <p>• <strong className="text-text">USJ 가격 캘린더</strong> 평일 선택으로 1인당 ¥1,000~3,000 절약</p>
          </div>
        </div>
      </div>
    </section>
  )
}
