import { useTheme } from '../contexts/ThemeContext'

export default function Hero() {
  const { theme } = useTheme()
  const isWafu = theme === 'wafu'

  return (
    <header className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 text-center px-4">
      {isWafu && (
        <>
          <div className="wafu-cloud" style={{ top: '20%', left: '5%' }} aria-hidden="true" />
          <div className="wafu-cloud" style={{ top: '15%', right: '5%', transform: 'scaleX(-1)' }} aria-hidden="true" />
        </>
      )}
      <h1 className={`font-serif text-4xl md:text-6xl font-bold text-ai tracking-tight ${isWafu ? 'wafu-heading' : ''}`}>
        오사카·교토
      </h1>
      <p className="mt-3 text-xl md:text-2xl text-ai/70 font-sans font-light">
        여행 플래너
      </p>
      <p className="mt-4 text-sm md:text-base text-text-light">
        2026년 5월 중순 · 2인 커플
      </p>
      <div className={`mt-8 mx-auto w-24 h-px ${isWafu ? 'wafu-divider' : 'bg-gradient-to-r from-transparent via-kin to-transparent'}`} />
    </header>
  )
}
