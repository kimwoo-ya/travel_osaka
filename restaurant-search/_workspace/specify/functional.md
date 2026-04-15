# Functional Specification: restaurant-search v2

**Created**: 2026-04-15
**Status**: Draft
**Input**: `restaurant-search/next_goals.md` 요구사항 + 결정사항

---

## 1. User Stories

### US-01. 지역+카테고리 자유 검색 (Priority: P1)

여행 계획자로서, 특정 지역과 음식 카테고리를 지정하여 tabelog 식당을 검색하고 싶다.
기존 슬롯 모드(main.py)는 사전 정의된 슬롯만 검색할 수 있어서, 즉석에서 "도톤보리 라멘" 같은 자유 검색이 불가능했다. v2는 이 제약을 해소한다.

**Why this priority**: 프로젝트의 핵심 존재 이유. 이것 없이는 v2의 가치가 없다.

**Independent Test**: `search.py --area "道頓堀" --category ramen`을 실행하면 도톤보리 지역의 라멘 식당 목록이 터미널에 출력된다.

**Acceptance Scenarios**:

1. **Given** search.py가 설치되어 있고 네트워크 연결이 가능한 상태,
   **When** `python search.py --area "道頓堀" --category ramen`을 실행하면,
   **Then** 도톤보리 지역의 라멘 카테고리 식당 목록이 출력되며, 각 결과에 가게명(일본어), 카테고리, 평점, 리뷰수, 가격대, tabelog URL이 포함된다.

2. **Given** search.py가 설치되어 있고 네트워크 연결이 가능한 상태,
   **When** `python search.py --area "梅田"`을 실행하면(카테고리 미지정),
   **Then** 우메다 지역의 모든 카테고리 식당이 검색된다.

3. **Given** search.py가 설치되어 있고 네트워크 연결이 가능한 상태,
   **When** `python search.py --category yakiniku`를 실행하면(지역 미지정),
   **Then** 지역 미지정 에러 메시지가 출력되고 프로그램이 종료된다. (지역은 필수 파라미터)

---

### US-02. 품질 필터링 (Priority: P1)

여행 계획자로서, 최소 평점과 최소 리뷰수를 지정하여 검증된 식당만 걸러내고 싶다.
tabelog에는 수만 개의 식당이 등록되어 있으나, 여행자에게는 평점 3.0 이상이면서 리뷰가 충분한 곳만 의미 있다.

**Why this priority**: 필터 없는 검색은 노이즈 투성이. 검색과 동일하게 핵심 기능이다.

**Independent Test**: `--score 3.5 --reviews 100`을 추가하면 해당 기준 미달 식당이 결과에서 제외된다.

**Acceptance Scenarios**:

1. **Given** 검색 결과에 평점 3.2, 3.5, 3.8인 식당이 존재할 때,
   **When** `--score 3.5`를 지정하면,
   **Then** 평점 3.5 미만인 식당(3.2)은 결과에 포함되지 않는다.

2. **Given** 검색 결과에 리뷰수 50, 200, 500인 식당이 존재할 때,
   **When** `--reviews 200`을 지정하면,
   **Then** 리뷰 200개 미만인 식당(50)은 결과에 포함되지 않는다.

3. **Given** `--score`와 `--reviews`를 모두 생략한 경우,
   **When** 검색을 실행하면,
   **Then** 필터 없이 모든 검색 결과가 반환된다. (기본값: 필터 없음, 즉 score=0, reviews=0)

---

### US-03. 검색 범위 제어 (Priority: P2)

여행 계획자로서, 검색할 페이지 수와 최대 결과 수를 제한하여 검색 시간과 서버 부하를 조절하고 싶다.
tabelog 스크래핑은 페이지당 3초 딜레이가 필요하므로, 불필요하게 많은 페이지를 조회하면 시간이 오래 걸린다.

**Why this priority**: 사용성에 중요하지만 기본값만으로도 작동 가능하므로 P2.

**Independent Test**: `--pages 2 --limit 10`을 지정하면 최대 2페이지까지만 조회하고, 결과가 10개에 도달하면 즉시 중단한다.

**Acceptance Scenarios**:

1. **Given** 검색 대상 지역에 5페이지 이상의 결과가 있을 때,
   **When** `--pages 3`을 지정하면,
   **Then** 최대 3페이지까지만 조회하고 이후 페이지는 요청하지 않는다.

2. **Given** 검색 중 이미 15개의 식당이 수집된 상태에서,
   **When** `--limit 15`가 지정되어 있으면,
   **Then** 남은 페이지가 있더라도 검색을 즉시 종료한다.

3. **Given** `--pages`와 `--limit`를 모두 생략한 경우,
   **When** 검색을 실행하면,
   **Then** 기본값(pages=3, limit=20)이 적용된다.

4. **Given** `--limit 5`와 `--pages 10`을 동시에 지정한 경우,
   **When** 1페이지에서 이미 5개 이상의 결과가 나오면,
   **Then** limit 조건이 먼저 충족되어 검색이 종료된다. (두 조건 중 먼저 충족되는 쪽이 우선)

---

### US-04. CSV 파일 출력 (Priority: P1)

여행 계획자로서, 검색 결과를 CSV 파일로 저장하여 스프레드시트에서 정렬/비교하거나, 여행 사이트(site/)의 데이터 소스로 활용하고 싶다.

**Why this priority**: 기존 main.py의 핵심 출력 형식이며, 여행 사이트 데이터 파이프라인과 직결된다.

**Independent Test**: `--format csv`로 실행하면 현재 디렉토리에 CSV 파일이 생성된다.

**Acceptance Scenarios**:

1. **Given** 검색 결과가 존재할 때,
   **When** `--format csv`를 지정하거나 format 옵션을 생략하면(기본값),
   **Then** `results_{timestamp}.csv` 파일이 생성되며, 헤더 행 + 데이터 행으로 구성된다.

2. **Given** CSV 파일이 생성되었을 때,
   **When** 파일 내용을 확인하면,
   **Then** 각 행에 name, nameJa, category, area, tabelog(평점), reviews(리뷰수), price, tabelogUrl 컬럼이 포함된다.

3. **Given** CSV 파일이 생성되었을 때,
   **When** 파일 인코딩을 확인하면,
   **Then** UTF-8 BOM(utf-8-sig) 인코딩으로, Excel에서 한글/일본어가 깨지지 않는다.

---

### US-05. JSON 파일 출력 (Priority: P2)

여행 계획자로서, 검색 결과를 JSON으로 저장하여 프로그래밍적으로 후처리하거나 다른 스크립트에 파이프하고 싶다.

**Why this priority**: CSV 대비 구조화된 데이터가 필요한 경우에 유용하지만, 필수는 아님.

**Independent Test**: `--format json`으로 실행하면 JSON 파일이 생성되고, 유효한 JSON으로 파싱 가능하다.

**Acceptance Scenarios**:

1. **Given** 검색 결과가 존재할 때,
   **When** `--format json`을 지정하면,
   **Then** `results_{timestamp}.json` 파일이 생성되며 유효한 JSON 배열이다.

2. **Given** JSON 파일이 생성되었을 때,
   **When** 파일 내용을 확인하면,
   **Then** 각 객체에 CSV와 동일한 필드(name, nameJa, category, area, tabelog, reviews, price, tabelogUrl)가 포함된다.

---

### US-06. 터미널 테이블 출력 (Priority: P2)

여행 계획자로서, 검색 결과를 터미널에서 바로 확인하여 파일을 열지 않고도 빠르게 식당을 비교하고 싶다.

**Why this priority**: 빠른 미리보기에 유용하지만, 파일 저장과 달리 데이터가 휘발된다.

**Independent Test**: `--format table`로 실행하면 터미널에 정렬된 표가 출력된다.

**Acceptance Scenarios**:

1. **Given** 검색 결과가 존재할 때,
   **When** `--format table`을 지정하면,
   **Then** 터미널(stdout)에 가게명, 카테고리, 평점, 리뷰수, 가격대가 정렬된 테이블 형태로 출력된다.

2. **Given** 검색 결과가 존재할 때,
   **When** `--format table`을 지정하면,
   **Then** 파일은 생성되지 않는다. (stdout 전용)

3. **Given** 검색 결과가 0건일 때,
   **When** `--format table`을 지정하면,
   **Then** "검색 결과가 없습니다" 메시지가 출력된다.

---

### US-07. 기존 슬롯 모드와의 공존 (Priority: P3)

여행 계획자로서, v2 자유 검색(search.py)을 사용하면서도 기존 슬롯 배치 검색(main.py)을 그대로 사용할 수 있어야 한다.

**Why this priority**: 기존 기능 보전. 새 코드가 기존 코드를 깨뜨리지 않으면 충분.

**Independent Test**: search.py 추가 후에도 `python main.py`가 기존과 동일하게 작동한다.

**Acceptance Scenarios**:

1. **Given** search.py가 추가된 상태에서,
   **When** `python main.py O2-18:30`을 실행하면,
   **Then** 기존과 동일하게 슬롯 기반 검색이 수행되고 CSV가 생성된다.

2. **Given** search.py와 main.py가 공존할 때,
   **When** 양쪽 모두 `tabelog.py`의 `search()` 함수를 호출하면,
   **Then** 충돌이나 임포트 에러 없이 정상 작동한다.

---

## 2. Functional Requirements

### 검색 파라미터

- **FR-001**: 시스템은 `--area` 옵션으로 지역명(일본어 프리텍스트)을 받아 해당 지역의 식당을 검색해야 한다(MUST). `--area`는 필수 파라미터이다.
- **FR-002**: 시스템은 `--category` 옵션으로 카테고리 키워드(영문 약어)를 받아 해당 카테고리로 검색 범위를 좁혀야 한다(SHOULD). 카테고리 미지정 시 전체 카테고리를 검색한다.
- **FR-003**: 시스템은 20~30개의 주요 카테고리 매핑을 제공해야 한다(MUST). 예: `ramen` → `ラーメン`, `yakiniku` → `焼肉`, `sushi` → `寿司` 등. 매핑에 없는 카테고리 입력 시 에러 메시지와 함께 사용 가능한 카테고리 목록을 출력한다.
- **FR-004**: 시스템은 `--score` 옵션으로 최소 tabelog 평점(float)을 받아 해당 점수 미만인 식당을 필터링해야 한다(MUST). 기본값: 필터 없음(0.0).
- **FR-005**: 시스템은 `--reviews` 옵션으로 최소 리뷰수(int)를 받아 해당 수 미만인 식당을 필터링해야 한다(MUST). 기본값: 필터 없음(0).
- **FR-006**: 시스템은 `--pages` 옵션으로 조회할 최대 페이지 수(int)를 받아야 한다(MUST). 기본값: 3.
- **FR-007**: 시스템은 `--limit` 옵션으로 최대 결과 수(int)를 받아야 한다(MUST). 수집된 결과가 limit에 도달하면 남은 페이지를 조회하지 않고 즉시 종료한다. 기본값: 20.

### 출력 형식

- **FR-008**: 시스템은 `--format` 옵션으로 출력 형식을 선택할 수 있어야 한다(MUST). 유효값: `csv`(기본값), `json`, `table`.
- **FR-009**: CSV 출력 시 파일명은 `results_{YYYYMMDD_HHMMSS}.csv`이며, UTF-8 BOM 인코딩을 사용해야 한다(MUST).
- **FR-010**: JSON 출력 시 파일명은 `results_{YYYYMMDD_HHMMSS}.json`이며, `ensure_ascii=False`로 유니코드 원문을 보존해야 한다(MUST).
- **FR-011**: table 출력 시 stdout에만 출력하고 파일을 생성하지 않아야 한다(MUST).
- **FR-012**: 검색 결과가 0건일 때, 모든 출력 형식에서 "검색 결과가 없습니다" 메시지를 stderr로 출력해야 한다(MUST). CSV/JSON의 경우 빈 파일을 생성하지 않는다.

### CLI 인터페이스

- **FR-013**: 진입점은 `search.py`이며, `argparse`로 옵션을 처리해야 한다(MUST).
- **FR-014**: `--help` 옵션 실행 시 모든 옵션의 설명, 기본값, 사용 예시가 출력되어야 한다(MUST).
- **FR-015**: 잘못된 옵션 또는 유효하지 않은 값 입력 시, 명확한 에러 메시지와 함께 올바른 사용법을 안내해야 한다(MUST). 예: `--score abc` → "Error: --score는 숫자여야 합니다."
- **FR-016**: `--category` 옵션에 매핑에 없는 값이 들어오면, 에러 메시지와 사용 가능한 카테고리 목록을 출력해야 한다(MUST).

### 기존 시스템 공존

- **FR-017**: `search.py`는 `main.py`, `slots.py`의 코드를 수정하지 않아야 한다(MUST).
- **FR-018**: `search.py`와 `main.py`는 `tabelog.py`를 공통 모듈로 공유해야 한다(MUST). tabelog.py의 기존 인터페이스(`search()` 함수 시그니처)는 유지한다.

### 검색 결과 데이터

- **FR-019**: 각 검색 결과에는 다음 필드가 포함되어야 한다(MUST): 가게명(일본어), 카테고리, 세부지역, 평점, 리뷰수, 가격대(점심/저녁), tabelog URL.
- **FR-020**: 검색 결과는 평점 내림차순으로 정렬되어야 한다(MUST). 평점 동일 시 리뷰수 내림차순.
- **FR-021**: 동일 식당이 여러 페이지에 걸쳐 중복 등장할 경우, 한 번만 포함해야 한다(MUST). 가게명+URL 기준으로 중복 판별.

### 진행 상태 표시

- **FR-022**: 검색 진행 중 현재 페이지 번호와 누적 결과 수를 stderr로 출력해야 한다(SHOULD). 예: `[2/5] 12건 수집 중...`

---

## 3. Key Entities

### Restaurant (식당)

검색 결과의 단위 엔티티. tabelog 한 개 가게에 대응한다.

| 속성 | 설명 |
|------|------|
| name_ja | 가게 이름 (일본어 원문) |
| category | 음식 카테고리 (예: ラーメン, 焼肉) |
| area_detail | 세부 지역명 (tabelog 표기) |
| rating | tabelog 평점 (0.0~5.0) |
| review_count | 리뷰 수 (0 이상 정수) |
| price_lunch | 점심 가격대 (문자열, 없으면 빈 값) |
| price_dinner | 저녁 가격대 (문자열, 없으면 빈 값) |
| url | tabelog 상세 페이지 URL |
| map_query | 지도 검색용 쿼리 문자열 |

### Category (카테고리)

tabelog 음식 카테고리의 매핑 엔티티. 사용자 친화적 키워드와 tabelog 내부 코드/검색어를 연결한다.

| 속성 | 설명 |
|------|------|
| key | 사용자 입력 키워드 (영문 소문자, 예: `ramen`) |
| label_ja | 일본어 카테고리명 (예: `ラーメン`) |
| code | tabelog 카테고리 코드 (예: `RC0111`, 후순위 지역코드 검색 시 사용) |

### SearchRequest (검색 요청)

사용자의 CLI 입력을 구조화한 엔티티.

| 속성 | 설명 |
|------|------|
| area | 검색 지역 (일본어 프리텍스트, 필수) |
| category | 카테고리 키워드 (선택, 미지정 시 전체) |
| min_score | 최소 평점 (기본값: 0.0) |
| min_reviews | 최소 리뷰수 (기본값: 0) |
| max_pages | 최대 페이지 수 (기본값: 3) |
| limit | 최대 결과 수 (기본값: 20) |
| output_format | 출력 형식 (csv / json / table, 기본값: csv) |

---

## 4. Success Criteria

- **SC-001**: `search.py --area "道頓堀" --category ramen --score 3.0 --format table` 실행 시 3초 이내에 첫 번째 결과가 표시된다 (네트워크 응답 시간 제외).
- **SC-002**: 기존 `main.py` 실행이 search.py 추가 전후로 동일하게 작동한다.
- **SC-003**: CSV/JSON 출력 파일이 외부 도구(Excel, jq)에서 정상적으로 열린다.
- **SC-004**: 매핑된 20개 이상의 카테고리로 검색 시 정상 결과가 반환된다.

---

## 5. Assumptions

- 사용자는 Python 3.10+ 환경에서 실행한다.
- tabelog의 HTML 구조(CSS 셀렉터)가 현재 tabelog.py에서 파싱하는 형태를 유지한다. 구조 변경 시 tabelog.py 수정이 필요하며, 이는 v2 범위 밖이다.
- 네트워크 연결이 가능하며, tabelog.com 접근이 차단되지 않은 환경이다.
- 요청 간 딜레이(3초)는 유지한다. 이를 줄이면 IP 차단 위험이 있다.
- 한국어 가게명은 v2에서 제공하지 않는다 (name = nameJa). 한국어 매핑은 후순위.
- 지역코드(`/A2701/...`) 기반 정밀 검색은 v2 범위 밖이다 (Backlog B1).
- 전체 카테고리 자동 수집은 v2 범위 밖이다 (Backlog B2).

---

## 6. Edge Cases (참고 - edge 분석가 검토 대상)

- `--area`에 존재하지 않는 지역명을 입력한 경우: tabelog가 0건 반환 -> FR-012에 따라 "검색 결과가 없습니다" 처리.
- `--score 5.0`처럼 비현실적으로 높은 점수를 지정한 경우: 결과 0건으로 정상 처리.
- `--pages 0` 또는 `--limit 0`: 유효하지 않은 입력으로 에러 처리 (양수만 허용).
- `--score -1.0` 또는 `--reviews -5`: 유효하지 않은 입력으로 에러 처리 (0 이상만 허용).
- tabelog 서버 응답 실패 (네트워크 에러, 503 등): 기존 tabelog.py의 재시도 로직 활용, 최종 실패 시 수집된 데이터까지만 출력.
- 검색 결과가 수천 건인 경우: `--limit`과 `--pages`로 자연스럽게 제한됨.
- 동일 가게가 여러 페이지에 중복 등장: FR-021의 중복 제거 로직으로 처리.
