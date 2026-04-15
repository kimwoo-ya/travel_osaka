# restaurant-search

tabelog 기반 대안 식당 검색 스크립트.

## 설치

```bash
pip install -r requirements.txt
```

의존성: `requests`, `beautifulsoup4`, `tabulate`

## 자유 검색 (search.py) — v2

임의 지역/카테고리를 자유롭게 검색하는 CLI 도구.

```bash
# 기본 사용
python search.py --area "道頓堀" --category ramen --score 3.0

# 필터 + 결과 제한
python search.py --area "梅田" --reviews 200 --limit 10 --pages 5

# 출력 형식
python search.py --area "京都駅" --format csv     # CSV 파일 (기본값)
python search.py --area "京都駅" --format json    # JSON 파일
python search.py --area "京都駅" --format table   # 터미널 테이블
```

### 옵션

| 옵션 | 필수 | 기본값 | 설명 |
|------|:---:|--------|------|
| `--area` | O | — | 검색 지역명 (일본어) |
| `--category` | | 전체 | 카테고리 키워드 (아래 목록 참조) |
| `--score` | | 0.0 | 최소 tabelog 평점 (0.0~5.0) |
| `--reviews` | | 0 | 최소 리뷰수 |
| `--pages` | | 3 | 최대 페이지수 (1~20) |
| `--limit` | | 20 | 최대 결과수 (1~100) |
| `--format` | | csv | 출력 형식 (csv/json/table) |

### 카테고리 목록

| key | 일본어 | 한국어 |
|-----|--------|--------|
| `ramen` | ラーメン | 라멘 |
| `tsukemen` | つけ麺 | 츠케멘 |
| `udon` | うどん | 우동 |
| `soba` | そば | 소바 |
| `sushi` | 寿司 | 초밥 |
| `yakiniku` | 焼肉 | 야키니쿠 |
| `horumon` | ホルモン | 호르몬 |
| `tempura` | 天ぷら | 텐푸라 |
| `tendon` | 天丼 | 텐동 |
| `tonkatsu` | とんかつ | 돈카츠 |
| `gyukatsu` | 牛カツ | 규카츠 |
| `okonomiyaki` | お好み焼き | 오코노미야키 |
| `takoyaki` | たこ焼き | 타코야키 |
| `yakitori` | 焼鳥 | 야키토리 |
| `kushikatsu` | 串カツ | 쿠시카츠 |
| `izakaya` | 居酒屋 | 이자카야 |
| `curry` | カレー | 카레 |
| `oden` | おでん | 오뎅 |
| `gyoza` | 餃子 | 교자 |
| `cafe` | カフェ | 카페 |
| `sweets` | スイーツ | 디저트 |
| `bread` | パン | 빵 |
| `obanzai` | おばんざい | 오반자이 |
| `teppanyaki` | 鉄板焼き | 철판야키 |
| `shabu` | しゃぶしゃぶ | 샤부샤부 |
| `sukiyaki` | すき焼き | 스키야키 |
| `kaisendon` | 海鮮丼 | 해산물덮밥 |
| `streetfood` | 食べ歩き | 길거리음식 |

### 출력 형식

| 형식 | 파일명 | 특이사항 |
|------|--------|---------|
| csv | `results_{timestamp}.csv` | UTF-8 BOM, Excel 호환 |
| json | `results_{timestamp}.json` | priceLunch/priceDinner 분리 |
| table | stdout | 파일 미생성, 터미널 전용 |

---

## 슬롯 배치 검색 (main.py)

```bash
# 전체 8슬롯 실행
python main.py

# 특정 슬롯만 실행
python main.py "O2-18:30"

# 프리픽스로 필터
python main.py O        # 오사카 전체 (O로 시작하는 슬롯)
python main.py K        # 교토 전체
python main.py O2       # O2-* 슬롯들 (도톤보리)
python main.py O2 K3    # 복수 프리픽스 조합

# 자유형 검색 (슬롯에 없는 장소도 검색 가능)
python main.py "오사카 혼마치 10:00"   # 혼마치 오전 → 점심 쿼리
python main.py "교토 기온 18:00"       # 기온 저녁 → 디너 쿼리
python main.py "오사카 신사이바시"      # 시간 생략 시 12:00(점심) 기본값
```

### 자유형 검색

슬롯 매칭 실패 시 자동으로 자유형 모드로 전환된다.

**형식**: `"{지역} {장소} {시간}"`

- **지역**: `오사카`/`osaka`, `교토`/`kyoto`
- **장소**: 한국어 지명 (내장 매핑) 또는 일본어 직접 입력
- **시간**: `HH:MM` (생략 시 `12:00`)

시간대별 자동 생성 쿼리:

| 시간대 | 쿼리 키워드 |
|--------|-------------|
| ~13:59 (점심) | ランチ, グルメ, カフェ |
| 14:00~16:59 (간식) | カフェ, スイーツ, 食べ歩き |
| 17:00~ (저녁) | ディナー, 居酒屋, グルメ |

내장 한국어→일본어 지명 매핑: 도톤보리, 우메다, 난바, 우라난바, 아메리카무라, 신사이바시, 혼마치, 텐노지, 텐마, 나카자키초, 쿠로몬시장, 교토역, 기온, 가와라마치, 니시키시장

## 슬롯 목록

아래 순서대로 처리된다. **처리 순서가 중요** — 슬롯 간 중복 제거 시 먼저 처리된 슬롯이 우선한다.

| 순서 | ID | 설명 |
|:---:|----|------|
| 1 | O2-18:30 | 도톤보리 저녁 간식 |
| 2 | O2-11:30 | 도톤보리 점심 |
| 3 | O4-19:30 | 우라난바 저녁 |
| 4 | O1-17:30 | 우메다 간식 (신우메다 쇼쿠도가이) |
| 5 | O3-15:30 | 아메리카무라 간식 |
| 6 | O4-12:30 | 우메다 점심 |
| 7 | K2-18:00 | 난바 저녁 (교토 복귀 후) |
| 8 | K3-17:00 | 교토역 저녁 |

## 검색 원리

tabelog의 `/{prefecture}/rstLst/?sw={키워드}` 엔드포인트를 사용한다.

- `prefecture`: `osaka`, `kyoto` 등 도도부현 코드
- `sw`: 지역명과 키워드를 합친 프리텍스트 검색어
- **페이지네이션**: 쿼리당 최대 3페이지까지 탐색 (페이지당 ~20건)
- **요청 간격**: 페이지 간 3초 딜레이
- **재시도**: 요청 실패 시 최대 3회 재시도 (지수 백오프)

예: `https://tabelog.com/osaka/rstLst/?sw=道頓堀+餃子`

### 슬롯 추가/수정

`slots.py`에 새 슬롯을 추가할 때:

```python
{
    "id": "O5-12:00",
    "label": "텐노지 점심",
    "area": "텐노지",
    "prefecture": "osaka",           # 도도부현
    "avoid_categories": ["ラーメン"],  # 제외할 카테고리 (일본어)
    "queries": ["天王寺 カレー", "天王寺 うどん"],  # 지역명 + 키워드
}
```

`queries`에 지역명을 포함시키면 tabelog가 해당 지역 내 결과를 반환한다.

## 출력

`results_YYYYMMDD_HHMMSS.csv` 파일이 생성된다.

### CSV 컬럼

| 컬럼 | 설명 |
|------|------|
| `name` | 가게 이름 (현재 일본어 이름과 동일) |
| `nameJa` | 일본어 이름 |
| `category` | 업종 (tabelog 분류) |
| `area` | 지역 상세 (tabelog 표기) |
| `tabelog` | 평점 (예: 3.42) |
| `reviews` | 리뷰 수 |
| `price` | 가격대 (점심 → 저녁 순, 없으면 `?`) |
| `reservation` | 항상 `워크인` (고정값) |
| `recommended` | 빈 값 (수동 기입용) |
| `forSlot` | 해당 슬롯 ID |
| `mapQuery` | 지도 검색용 문자열 (`{가게명} {지역}`) |
| `tabelogUrl` | tabelog 상세 페이지 URL |

## 필터 및 정렬

- tabelog 점수 **3.0 이상**
- 리뷰 **400건 이상** (3.4+ & 800건 이상이면 강력추천 `★` 표시)
- 슬롯당 최대 **4건** 선정
- 각 슬롯의 `avoid_categories`에 해당하는 업종 자동 제외
- **슬롯 간 중복 제거**: 이전 슬롯에서 선정된 가게는 이후 슬롯 후보에서 제외
- **정렬**: 평점 내림차순 → 리뷰 수 내림차순

## 알려진 제한사항

- **name 컬럼**: tabelog에 한국어 이름이 없어 일본어 이름이 그대로 들어감 (`name` = `nameJa`)
- **키워드 검색 의존**: 지역 코드 기반 브라우징(`/osaka/A2701/A270101/rstLst/`)이 아닌 프리텍스트 검색(`sw=`)을 사용하므로, 키워드에 매칭되지 않는 가게는 누락될 수 있음
- **CSS 셀렉터 하드코딩**: tabelog HTML 구조 변경 시 파싱이 깨질 수 있음. 사용 중인 셀렉터: `.list-rst`, `.list-rst__rst-name-target`, `.list-rst__area-genre`, `.c-rating__val`, `.list-rst__rvw-count-num`, `.c-rating-v3__val`
