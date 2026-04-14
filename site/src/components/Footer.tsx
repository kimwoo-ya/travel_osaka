export default function Footer() {
  return (
    <footer className="py-10 px-4 text-center text-xs md:text-sm text-text-light space-y-2 border-t border-border">
      <p>2026-04-14 조사 기준 · 가격/영업시간은 방문 전 확인 필요</p>
      <p>
        맛집 기준:{' '}
        <a
          href="https://tabelog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-shu transition-colors"
        >
          tabelog
        </a>{' '}
        3.0+ &amp; 400건+ 리뷰 신뢰도 적용
      </p>
    </footer>
  )
}
