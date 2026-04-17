# Travel — 오사카 여행 계획 공유 사이트

오사카(+ USJ + 교토) 여행 계획을 동적으로 조절하고 공유할 수 있는 GitHub Pages 정적 사이트.

**Live**: https://kimwoo-ya.github.io/travel_osaka/

## 주요 기능

- **일정 조절** — 오사카 슬라이더(1~5박) + USJ 토글(+1일) + 교토 토글(Off / 1박2일 / 2박3일)
- **3단 예산** — 저가 / 중간 / 럭셔리 티어별 숙소·식비·교통·관광·쇼핑 비용 자동 재계산
- **식당 대안 선택** — 28개 식사 슬롯마다 2~4개의 대안(총 107개) 제공, 클릭으로 교체
- **여행 기록 저장·공유** — localStorage 자동 저장 + URL로 현재 선택 상태 공유
- **和風 테마 토글** — 기본/일본풍 테마 전환 (사쿠라·아사노하·구름 SVG 패턴, 두루마리 펼침 애니메이션)
- **반응형** — 모바일 first, 데스크톱/태블릿 최적화
- **접근성** — ARIA 속성, `prefers-reduced-motion`, 44px 터치 타겟, 최소 폰트 12px

## 기술 스택

| 영역 | 스택 |
|------|------|
| 빌드 | Vite 8 |
| UI | React 19 + TypeScript |
| 스타일 | Tailwind CSS v4 (@tailwindcss/vite) |
| 애니메이션 | Framer Motion 12 |
| 린트 | ESLint 9 + typescript-eslint 8 |
| 데이터 수집 | Python 3.10+ (requests, beautifulsoup4) — [tabelog_scrapper](https://github.com/kimwoo-ya/tabelog_scrapper) |

## 디렉토리 구조

```
travel/
├── site/                          # 프론트엔드 (Vite + React)
│   ├── src/
│   │   ├── components/            # Hero, ControlBar, DayCard, BudgetSection, Footer
│   │   ├── contexts/              # TripContext, ThemeContext
│   │   ├── data/
│   │   │   ├── travel.ts          # 일정 데이터 + 타입 정의
│   │   │   ├── restaurants.json   # 레퍼런스 식당 목록
│   │   │   └── alternatives.json  # 슬롯별 대안 (28 슬롯 × 평균 3.8개)
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── tabelog_scrapper/              # tabelog 검색 도구 (별도 레포, submodule 아님)
├── _workspace/                    # 리서치 원본, 리뷰 보고서, 수집 가이드
├── specs/                         # 기능 명세 (spec-kit 기반)
├── CLAUDE.md                      # 프로젝트 규칙 (에이전트용)
└── ROADMAP.md                     # 작업 단계 체크리스트
```

## 개발

```bash
cd site
npm install
npm run dev        # 개발 서버 (HMR)
npm run build      # tsc -b && vite build → dist/
npm run lint       # ESLint
npm run preview    # 빌드 결과 로컬 확인
```

## 배포

`main` 브랜치 푸시 시 GitHub Actions가 `site/` 빌드 후 GitHub Pages에 자동 배포.

## 데이터 규칙

- **우선순위 체계** — 1(필수/2박3일) → 2(추천/4박5일) → 3(여유/6박7일)
- **동선 원칙** — 하루 1~2 인접 권역, 이동 방향 통일, 풀데이(USJ) 독립 배정
- **검색 전략** — 한/일/영 3개 언어 병행, 맛집은 tabelog(食べログ) 3.0+ 기준
- **예산** — 항공권 제외, 현지 비용만, 저가/중간/럭셔리 3단계

자세한 규칙은 [CLAUDE.md](./CLAUDE.md) 참조.

---

## 개발 히스토리

### Phase 1: 하네스 구축
여행 계획 생성용 에이전트 팀 정의 (travel-planner / budget-analyst / food-researcher)와 오케스트레이터 스킬 작성. 여행 컨텍스트 수립, 일본어 검색 전략·동선 최적화 원칙 확정.

### Phase 2: 콘텐츠 리서치
오사카 3개 에이전트 병렬 실행 → 22개 장소(8개 권역), 3단계 예산표, 22개 식당. 교토 추가 리서치 → 16개 장소, 13개 식당 + 니시키 시장 길거리음식 5종. tabelog 3.0+/리뷰 400건+ 기준으로 검증·대체.

### Phase 3: 데이터 통합
명소↔맛집↔예산 교차 매핑. 1박 단위 적층 구조(오사카 O1~O6 + USJ + 교토 K1~K3)로 일정 재설계.

### Phase 4: 정적 사이트 구축
Vite + React + TypeScript + Tailwind v4 + Framer Motion 선정. Hero / ControlBar(sticky) / DayCard / BudgetSection / Footer 구성. 반응형 디자인 + 예산 티어별 대체 데이터(foodLow/foodHigh, transportLow/transportHigh) 적용.

### Phase 5: 배포
GitHub 레포 초기화 → GitHub Pages Actions 워크플로우 → 공개 URL 확보.

### Phase 6: 보안 감사
PII 스캐너 / 시크릿 스캐너 / 코드 보안 리뷰어 3명 병렬 실행. **CRITICAL/HIGH 0건**. 예방적 개선 6건(MEDIUM 2, LOW 4) 발견 및 해결.

### Phase 7: 품질 검증 (제3자 리뷰)
데이터 팩트체크(OK 27/WARN 13/ERR 6), 동선 평가(GOOD 6/ACCEPTABLE 3/NEEDS_IMPROVEMENT 1), 예산 정합성(CONSISTENT 12/MINOR_GAP 3/INCONSISTENT 3), UI/UX 코드 리뷰.

### Phase 8: 리뷰 기반 개선
데이터 ERROR 6건 · 예산 INCONSISTENT 3건 수정. Day O4 연속 점심 2회 해소, 교토 Day 2 이동시간 보정. 접근성(ARIA), `prefers-reduced-motion`, 44px 터치 타겟, 최소 폰트 12px 적용.

### Phase 9: 和風 테마 토글
CSS 변수 9개 오버라이드 + 추가 5개, SVG 패턴 3종(사쿠라/아사노하/구름), 장식 클래스 6개. `[data-theme="wafu"]` 기반 전환, localStorage 저장, CSS transition 0.5s + 두루마리 펼침 모션.

### Phase 10: 메뉴 다양성 + 여행 기록 공유
기능 명세 작성(spec-kit). DayCard 대안 선택 UI (8 슬롯, 23개 대안 MVP), TripContext 생성, localStorage 저장/복원, URL 인코딩 공유. 27개 태스크 생성-검증 루프로 완료.

### Phase 11: 대안 식당 전체 확충
- 28개 식사 슬롯 전부 확충 (기존 11개 → 28개, 대안 33개 → 107개)
- tabelog 일괄 검색 도구(batch_search.py + assign_alternatives.py) 작성
- 15개 area 검색 실행 → 295건 풀 수집 후 슬롯별 배정 (가격 상한 + 카테고리 우선 매칭)
- 경험형 슬롯 4개(구로몬시장/덴포잔/호젠지/나라)는 명물 수동 입력
- K2:7 → K2:8 인덱스 버그 수정 (쇼핑 슬롯에 매핑되어 대안 버튼이 미노출되던 문제)
- travel.ts의 인라인 식당 데이터를 `restaurants.json`으로 분리

---

## 관련 레포

- [tabelog_scrapper](https://github.com/kimwoo-ya/tabelog_scrapper) — tabelog 검색 CLI + 배치 도구 + 슬롯 배정 스크립트 (Python)
