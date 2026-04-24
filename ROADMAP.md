# Travel — 오사카 여행 계획 공유 사이트

## 프로젝트 목표
GitHub Pages 정적 사이트로 오사카 여행 계획을 공유한다.
핵심 기능: 오사카 슬라이더(1박~5박) + USJ 토글 + 교토 토글(1박2일/2박3일)로 콘텐츠가 동적 노출된다.
확정 일정 JSON을 업로드하면 실제 날짜 기반 타임라인으로 전환, URL로 타인과 공유할 수 있다.

## 여행 파라미터
- **목적지**: 오사카, 일본
- **시기**: 2026년 5월 중순
- **인원**: 2명 (20대 중후 ~ 30대 초 커플)
- **일정 범위**: 1박2일 ~ 7박8일+ (가변, 1박 단위)
- **일정 구조**: 오사카(1~5박 슬라이더) + USJ(토글 +1일) + 교토(토글: off/1박2일/2박3일)
- **예산**: 저가 / 중간 / 럭셔리 3단계로 분석 (항공권 제외, 현지 비용만)
- **관심사**: 맛집, 포토스팟, 쇼핑, 야경, 체험(유카타 등), 테마파크(USJ), 현지 느낌
- **UI**: 슬라이더 또는 더 나은 대안이 있으면 제안

## 예산 범위 감잡기 (1일 2인, 현지 비용만)

| 티어 | 1일 (₩) | 2박3일 총 | 6박7일 총 | 컨셉 |
|------|---------|----------|----------|------|
| 저가 | ~₩9~15만 | ~₩30~45만 | ~₩70~120만 | 게하+편의점+도보 |
| 중간 | ~₩23~36만 | ~₩70~110만 | ~₩160~250만 | 비즈니스호텔+맛집 |
| 럭셔리 | ~₩50~90만+ | ~₩150~270만 | ~₩350~630만 | 4성급+고급식당+택시 |

> 에이전트가 웹 검색으로 실제 가격을 조사한 후 확정

## 데이터 설계

### 일정 구조
- **오사카**: 1박2일 ~ 5박6일 (슬라이더, 1박 단위로 Day 추가)
- **USJ**: 토글 On/Off (On 시 +1일 독립 배정)
- **교토**: 토글 Off / 1박2일 / 2박3일

### 우선순위 체계
각 장소/식당에 Day 번호를 부여하여 슬라이더 위치에 따라 노출:
- Day 1~2: 오사카 1박2일 (코어)
- Day 3~4: 오사카 확장
- Day 5~6: 오사카 심화
- USJ Day: 토글 On 시 독립 1일
- 교토 Day 1~3: 토글 On 시 추가

## 핵심 설계 결정

### 동선 원칙
- 하루 일정은 1~2 인접 권역 내에서만 구성 (동↔서 왕복 금지)
- 하루 내 이동 방향 통일 (북→남이면 계속 남쪽으로)
- 풀데이 장소(USJ 등)는 독립 일차로 배정
- 권역 지도를 먼저 정리하고 동선을 설계

### 검색 전략
- 한국어 + 일본어 + 영어 3개 언어로 검색
- 맛집: tabelog(食べログ) 3.0 이상 기준
- 일본어 소스: じゃらん, るるぶ, 食べログ, Retty 등

---

## 작업 단계

### Phase 1: 하네스 구축
- [x] 에이전트 정의 생성 (`travel-planner`, `budget-analyst`, `food-researcher`)
- [x] 오케스트레이터 스킬 생성 (`travel-orchestrator`)
- [x] 여행 컨텍스트 작성 (`_workspace/00_input/context.md`)
- [x] 에이전트 ↔ 스킬 분리 (에이전트=역할/원칙, 스킬=절차/출력형식)
- [x] 항공권 제외 반영
- [x] 일본어 검색 전략 추가
- [x] 동선 최적화 원칙 추가
- [x] 에이전트/스킬 최종 검수 (4건 수정: context.md 인원 표기, 스킬 번호 중복, budget 식비 검색 누락)
- [x] 오케스트레이터 최종 검수 (에이전트/스킬 참조, 워크플로우, 에러 핸들링 확인 — 문제 없음)

### Phase 2: 콘텐츠 리서치
- [x] 오사카 3개 에이전트 병렬 실행
  - [x] travel-planner → `_workspace/01_travel_planner_itinerary.md` (22개 장소, 8개 권역)
  - [x] budget-analyst → `_workspace/01_budget_analyst_breakdown.md` (3단계 예산표)
  - [x] food-researcher → `_workspace/01_food_researcher_guide.md` (22개 식당)
- [x] 교토 리서치 (에이전트 병렬 실행)
  - [x] travel-planner → `_workspace/01_kyoto_travel_planner_itinerary.md` (16개 장소, 8개 권역, 1박2일+2박3일 코스)
  - [x] food-researcher → `_workspace/01_kyoto_food_researcher_guide.md` (13개 식당 + 니시키 시장 길거리음식 5종)
- [x] 결과물 검수
  - [x] 교토 맛집 tabelog 점수 및 예약 정보 검증 → `_workspace/03_verification_kyoto.md`
  - [x] 오사카 맛집 tabelog 점수 및 예약 정보 검증 → `_workspace/03_verification_osaka.md`
  - [x] 신뢰도 기준 적용 (tabelog 3.0+ & 리뷰 400건+), 미달 식당 대체 → `_workspace/04_*.md`
  - [x] 통합 계획서에 대체 반영 완료

### Phase 3: 데이터 통합
- [x] 오사카 산출물 교차 매핑 (명소 ↔ 맛집 ↔ 예산)
- [x] 1박 단위 적층 구조로 일정 재설계 (오사카 Day O1~O6 + USJ Day + 교토 Day K1~K3)
- [x] 교토 일정 통합
- [x] 통합 계획서 갱신 (`_workspace/02_integrated_plan.md`)
- [x] 통합 결과 검수 (사용자 승인 완료)

### Phase 4: 인터렉티브한 정적 사이트(Desktop, Tablet, Mobile 최적화) 구축
- [x] 기술 스택 결정 → Vite + React + TypeScript + TailwindCSS v4 + Framer Motion
- [x] 일정 조절 UI 설계 → 오사카 슬라이더(1~5박) + USJ 토글 + 교토 3단 토글(없음/1박2일/2박3일)
- [x] 데이터 구조화 → `site/src/data/travel.ts` (TypeScript 타입 + 데이터)
- [x] 사이트 레이아웃 및 컴포넌트 개발
  - [x] Hero — 제목/부제/여행 파라미터
  - [x] ControlBar — sticky 일정 컨트롤 (슬라이더, 토글, 총 일수 계산)
  - [x] DayCard — 일별 타임라인 카드 (Framer Motion fade-in, tabelog 점수 표시)
  - [x] BudgetSection — 저가/중간/럭셔리 3단 예산 카드
  - [x] Footer — 조사 기준 및 출처
  - [x] App — 상태 관리 + 레이아웃 조합
- [x] 반응형 디자인 (모바일 first, md: 이상 데스크톱)
- [x] 빌드 확인 (`npm run build` 성공)
- [x] 예산 티어별 대체 데이터 추가 (O1~O6, USJ, K1~K3 전 Day)
  - [x] O1, O2: foodLow/foodHigh/noteLow/noteHigh + transportLow/transportHigh
  - [x] O3~O6, USJ, K1~K3: 동일 패턴 적용 (점심/저녁 식사 슬롯 중심)
  - [x] BudgetTier 타입 + getSlotFood/getSlotNote/getSlotMapQuery 헬퍼 함수
  - [x] DayPlan에 transportLow/transportHigh + getDayTransport 함수

### Phase 5: 배포
- [x] GitHub 저장소 초기화 → `https://github.com/kimwoo-ya/travel_osaka`
- [x] GitHub Pages 설정 (GitHub Actions 워크플로우)
- [x] 배포 및 공유 URL 확인 → `https://kimwoo-ya.github.io/travel_osaka/`

### Phase 6: 보안 감사
- [x] 보안 감사 하네스 구축 (에이전트 3 + 스킬 4)
- [x] PII 스캔 (개인정보 탐지) → 발견 0건 `_workspace/security/01_pii_scan_report.md`
- [x] Secret 스캔 (비밀 정보 + 의존성 취약점) → LOW 2건 `_workspace/security/01_secret_scan_report.md`
- [x] Code Security Review (프론트엔드 + CI/CD 보안) → MEDIUM 2 + LOW 2건 `_workspace/security/01_code_review_report.md`
- [x] 통합 보안 보고서 생성 → `_workspace/security/02_integrated_security_report.md`
- **결론: CRITICAL/HIGH 0건. Public 레포로 안전. 예방적 개선 6건 (MEDIUM 2, LOW 4)**

### Phase 7: 품질 검증 (제3자 리뷰)
- [x] 리뷰 하네스 구축 (에이전트 4 + 스킬 5)
- [x] 데이터 팩트체크 → `_workspace/05_data_verification_report.md` (OK 27 / WARNING 13 / ERROR 6)
- [x] 동선 평가 → `_workspace/05_route_review_report.md` (GOOD 6 / ACCEPTABLE 3 / NEEDS_IMPROVEMENT 1)
- [x] 예산 정합성 → `_workspace/05_budget_review_report.md` (CONSISTENT 12 / MINOR_GAP 3 / INCONSISTENT 3)
- [x] UI/UX 코드 리뷰 → `_workspace/05_ux_review_report.md` (접근성 NEEDS_IMPROVEMENT)
- [x] 통합 리뷰 보고서 → `_workspace/05_integrated_review.md`

### Phase 8: 리뷰 기반 개선
- [x] **데이터 수정** — ERROR 6건: 가격 인상분 반영 (오사카성, 스카이빌, 이마이, 한큐, 게이한, tabelog 점수)
- [x] **예산표 수정** — INCONSISTENT 3건: 난카이 라피트 운임, 2박3일 저가 산술 오류, 공항교통 포함 표기
- [x] **동선 수정** — Day O4 연속 점심 2회 해소, 교토 Day 2 이동시간 보정
- [x] **접근성 개선** — ControlBar ARIA 속성 추가 (`nav[aria-label]`, `role="switch"`, `aria-checked`, `aria-pressed`)
- [x] **시맨틱 HTML** — Hero `<header>` (기존 완료), App Timeline `<main>` 래핑
- [x] **모션 접근성** — `prefers-reduced-motion` 대응 (DayCard·BudgetSection `useReducedMotion`)
- [x] **터치/폰트** — ControlBar 터치 타겟 44px 확보 (`before:-inset-3`), 최소 폰트 `text-[10px]` → `text-xs`(12px)
- [x] **데이터 WARNING** — tabelog 본문/배치표 점수 통일, 기요미즈데라·USJ 가격 갱신
- [x] 수정 후 사이트 재배포

### Phase 9: 和風 테마 토글
- [x] 하네스 구축 (에이전트 3 + 스킬 3 + 오케스트레이터 1)
- [x] 和風 테마 스펙 설계 (CSS 변수 9개 오버라이드 + 추가 5개, SVG 패턴 3종, 장식 클래스 6개)
- [x] CSS 테마 시스템 구현 (`[data-theme="wafu"]` 오버라이드 + 사쿠라/아사노하/구름 패턴)
- [x] ThemeContext + 토글 컴포넌트 구현 (localStorage 저장, ControlBar 우측 배치)
- [x] 컴포넌트별 테마 적용 (Hero, DayCard, BudgetSection — wafu-card/stamp/shimmer/heading)
- [x] 전환 애니메이션 구현 (CSS transition 0.5s + 두루마리 펼침 Framer Motion variant)
- [x] UX 리뷰 (ACCEPTABLE) + 피드백 반영 (Hero overflow-hidden 1건)
- [x] 빌드 + 재배포

### Phase 10: 메뉴 다양성 + 여행 기록 공유
- [x] 기능 명세 작성 (`specs/001-menu-diversity-sharing/spec.md`)
- [x] 대안 식당 데이터 확보 → 수집 가이드: `_workspace/06_alt_restaurant_collection_guide.md`
  - [x] CSV→JSON 변환 스크립트 작성 (`restaurant-search/csv_to_json.py`)
  - [x] tabelog 검색 실행 (8개 슬롯, 23개 대안 확보)
  - [x] 동선 위반 5건 삭제 + 카테고리 한국어 번역 + 葉花 보충
- [x] Plan 단계 완료 (`specs/001-menu-diversity-sharing/plan.md`)
- [x] Tasks 생성 완료 (`specs/001-menu-diversity-sharing/tasks.md`, 27개 태스크)
- [x] 구현 하네스 구축 (react-implementer + qa-validator + feature-orchestrator)
- [ ] 구현 및 검증
  - [x] T001~T003: 데이터 파이프라인 (alternatives.ts, alternatives.json, csv_to_json.py)
  - [x] T004~T008: TripContext 생성 + App/ControlBar/BudgetSection 마이그레이션
  - [x] T009~T011: 대안 식당 데이터 수집 + 검수
  - [x] T012~T014: DayCard 대안 선택 UI (US1 MVP) — 검증 PASS
  - [x] T015~T018: localStorage 저장/복원 (US2) — 검증 PASS
  - [x] T019~T022: URL 공유 (US3) — 검증 PASS
  - [x] T023~T027: 폴리시 (UX 리뷰 ACCEPTABLE, HIGH 1+MEDIUM 2건 수정, 최종 빌드 PASS)
  - [ ] 배포 (GitHub Pages)

### Phase 11: 대안 식당 전체 확충
- [x] 전체 식당 슬롯 현황 정리 (28개 슬롯, 기존 11개만 대안 보유 → 전체 확충 결정)
- [x] tabelog 일괄 검색 도구 작성 (batch_search.py + assign_alternatives.py)
- [x] 15개 area 검색 실행 (295건 수집, score 3.35+/reviews 200+)
- [x] 슬롯별 대안 배정 (28개 슬롯 107개 대안, 가격 필터 + 카테고리 우선 매칭)
- [x] K2:7 → K2:8 인덱스 버그 수정 (쇼핑 슬롯에 매핑되어 대안 버튼 미노출)
- [x] alternatives.json 프로젝트 반영
- [x] travel.ts → JSON 분리 (restaurants.json 추출, import 전환)
- [x] 빌드 확인 (`vite build` 성공, 428 modules)

### Phase 12: 확정 일정 업로드 모드
- [ ] 확정 일정 JSON 스키마 정의 (날짜, 시간대별 슬롯, 장소, 식당, 숙소, 교통패스)
- [ ] Obsidian 마크다운 → JSON 변환 스크립트
- [ ] 파일 업로드 UI (FileReader API, 클라이언트 사이드 파싱)
- [ ] 확정 일정 뷰 컴포넌트 (실제 날짜 기반 타임라인 + 숙소 표시)
- [ ] 모드 전환 UI (탐색 모드 ↔ 확정 일정 모드)
- [ ] URL 공유 (JSON → pako deflate → base64url → URL hash)
- [ ] localStorage 캐싱 (업로드한 일정 재방문 시 유지)
- [ ] 빌드 + 배포
