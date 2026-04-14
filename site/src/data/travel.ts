export type BudgetTier = 'low' | 'mid' | 'high'

export interface TimeSlot {
  time: string
  place?: string
  food?: string        // 중간 티어 기본값
  foodLow?: string     // 저가 티어 대체
  foodHigh?: string    // 럭셔리 티어 대체
  note?: string
  noteLow?: string
  noteHigh?: string
  mapQuery?: string
  mapQueryLow?: string
  mapQueryHigh?: string
}

export function getSlotFood(slot: TimeSlot, tier: BudgetTier): string | undefined {
  if (tier === 'low' && slot.foodLow) return slot.foodLow
  if (tier === 'high' && slot.foodHigh) return slot.foodHigh
  return slot.food
}

export function getSlotNote(slot: TimeSlot, tier: BudgetTier): string | undefined {
  if (tier === 'low' && slot.noteLow) return slot.noteLow
  if (tier === 'high' && slot.noteHigh) return slot.noteHigh
  return slot.note
}

export function getSlotMapQuery(slot: TimeSlot, tier: BudgetTier): string | undefined {
  if (tier === 'low' && slot.mapQueryLow) return slot.mapQueryLow
  if (tier === 'high' && slot.mapQueryHigh) return slot.mapQueryHigh
  return slot.mapQuery
}

export interface DayPlan {
  id: string
  title: string
  subtitle: string
  theme: string
  area: string
  transport: string
  transportLow?: string
  transportHigh?: string
  slots: TimeSlot[]
}

export function getDayTransport(day: DayPlan, tier: BudgetTier): string {
  if (tier === 'low' && day.transportLow) return day.transportLow
  if (tier === 'high' && day.transportHigh) return day.transportHigh
  return day.transport
}

export function formatMan(won: number): string {
  return `${Math.round(won / 10000)}만`
}

export interface Restaurant {
  name: string
  nameJa: string
  category: string
  area: string
  tabelog: number
  reviews: number
  price: string
  reservation: '예약 필수' | '예약 추천' | '워크인' | '테이크아웃'
  recommended: string
  day: string
  warning?: boolean
}

export interface BudgetRow {
  category: string
  low: string
  mid: string
  high: string
}

// ─── Osaka Days ───

export const osakaDays: DayPlan[] = [
  {
    id: 'O1',
    title: 'Day 1',
    subtitle: '오사카 첫인상',
    theme: '오사카성 → 신사이바시 → 우메다 야경',
    area: '동→중→북',
    transport: '주유패스 1일권 (¥3,500)',
    transportLow: 'ICOCA 충전 (메트로 3~4회)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '09:00~12:00', place: '오사카성 천수각 + 공원 산책', note: '주유패스 무료', noteLow: '외관 무료 관람', mapQuery: '大阪城天守閣' },
      { time: '12:30~13:30', food: '이마이 우동 (3.58/2,266건)', foodLow: '마츠야 규동 ¥400~', foodHigh: '호텔 레스토랑 런치 코스 ¥3,000~', note: '키츠네 우동 ¥930', noteLow: '난바역 주변 체인', noteHigh: '숙소 근처 고급 런치', mapQuery: '道頓堀今井本店', mapQueryLow: '松屋 なんば', mapQueryHigh: 'スイスホテル南海大阪 レストラン' },
      { time: '13:30~15:00', place: '호텔 체크인', note: '난바/신사이바시 비즈니스호텔', noteLow: '난바 호스텔/게스트하우스', noteHigh: '스위소텔 난카이 or 콘래드 오사카' },
      { time: '15:00~17:00', place: '신사이바시스지 쇼핑', food: 'CENTRE M 카페 (3.55/426건)', foodLow: '편의점 커피 ¥150', foodHigh: 'CENTRE M 아프타눈티 세트 ¥4,000~', mapQuery: '心斎橋筋商店街' },
      { time: '17:30~18:00', food: '하나다코 타코야키 (3.68/2,806건)', note: '신우메다 쇼쿠도가이', mapQuery: 'はなだこ 新梅田食道街' },
      { time: '18:30~20:30', place: '우메다 스카이빌 공중정원', note: '일몰 ~18:50, 주유패스 무료', mapQuery: '梅田スカイビル空中庭園展望台' },
    ],
  },
  {
    id: 'O2',
    title: 'Day 2',
    subtitle: '먹고 걷고 또 먹기',
    theme: '구로몬시장 → 도톤보리 → 신세카이 → 하루카스',
    area: '남→남남',
    transport: '주유패스 1일권 (¥3,500)',
    transportLow: 'ICOCA 충전',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '09:00~11:00', place: '구로몬시장 탐방', food: '아침 해산물', foodLow: '편의점 아침 (오니기리+음료 ¥500)', foodHigh: '구로몬시장 성게·참치·과일 ¥3,000~', note: '오전이 가장 활기참', mapQuery: '黒門市場' },
      { time: '11:30~12:30', food: '미츠노 오코노미야키 (3.56/1,628건)', foodLow: '요시노야 규동 ¥500', foodHigh: '미츠노 오코노미야키 (3.56/1,628건)', note: '야마이모야키 ¥1,150', noteLow: '도톤보리 체인', mapQuery: '美津の 道頓堀', mapQueryLow: '吉野家 道頓堀' },
      { time: '13:00~14:30', place: '신세카이 + 츠텐카쿠', note: '주유패스 무료', noteLow: '거리 산책만 (입장료 절약)', mapQuery: '通天閣' },
      { time: '14:30~15:30', food: '다루마 쿠시카츠 (3.46/1,161건)', note: '소스 이중 찍기 금지!', mapQuery: '元祖串かつだるま新世界総本店' },
      { time: '16:00~17:30', place: '아베노하루카스 300 전망대', note: '일몰, 300m', noteLow: '전망대 스킵, 텐노지 공원 산책 (무료)', mapQuery: 'あべのハルカス ハルカス300' },
      { time: '18:30~', place: '도톤보리 야경 산책', food: '와나카 타코야키 (3.49/793건)', foodHigh: '카니도라쿠 게요리 디너 ¥8,000~', note: '4종 맛비교 ¥750', noteHigh: '도톤보리 본점, 예약 필수', mapQuery: '道頓堀', mapQueryHigh: 'かに道楽 道頓堀本店' },
    ],
  },
  {
    id: 'O3',
    title: 'Day 3',
    subtitle: '바다와 거리',
    theme: '해유관/덴포잔 → 아메리카무라 → 신사이바시',
    area: '서→중',
    transport: '주유패스 1일권 (¥3,500)',
    transportLow: 'ICOCA 충전 (메트로 2~3회)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '10:00~13:00', place: '해유관 (가이유칸)', note: '고래상어, 620종', mapQuery: '海遊館' },
      { time: '13:00~14:00', food: '덴포잔 마켓플레이스 점심', foodLow: '편의점 도시락 ¥500~700', foodHigh: '덴포잔 나니와 쿠이신보 요코쵸 해산물 ¥3,000~', mapQuery: '天保山マーケットプレース', mapQueryLow: 'セブンイレブン 天保山', mapQueryHigh: '天保山マーケットプレース レストラン' },
      { time: '14:00~14:30', place: '덴포잔 대관람차', note: '주유패스 무료', mapQuery: '天保山大観覧車' },
      { time: '15:30~16:30', food: '코가류 타코야키 (3.46/1,403건)', note: '아메리카무라, 소스마요 ¥600', mapQuery: '甲賀流本店 アメリカ村' },
      { time: '16:30~18:00', place: '신사이바시 쇼핑', mapQuery: '心斎橋筋商店街' },
      { time: '19:00~', food: '히데조 스시 (3.64/399건)', foodLow: '회전초밥 쿠라스시 ¥1,000~1,500', foodHigh: '오마카세 스시 ¥15,000~', note: '카운터 4석, 예약 추천', noteLow: '난바역 근처 체인 회전초밥', noteHigh: '난바 고급 오마카세, 예약 필수', mapQuery: '鮨ひでぞう 難波', mapQueryLow: 'くら寿司 なんば', mapQueryHigh: '鮨 なんば おまかせ' },
    ],
  },
  {
    id: 'O4',
    title: 'Day 4',
    subtitle: '레트로 감성과 밤의 난바',
    theme: '나카자키쵸 카페 → 우메다 맛집 → 호젠지/크루즈',
    area: '북→남',
    transport: '주유패스 1일권 (¥3,500)',
    transportLow: 'ICOCA 충전 (메트로 3~4회)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '10:00~12:00', place: '나카자키쵸 레트로 카페 거리', food: '밀향야 (3.55/393건) + hannoc (3.61/800건)', foodLow: '편의점 커피 ¥150', note: '고민가 카페 + 아트 케이크', noteLow: '카페 스킵, 거리 산책만', mapQuery: '中崎町カフェ', mapQueryLow: 'セブンイレブン 中崎町' },
      { time: '12:30~13:30', food: '키지 본점 오코노미야키 (3.67/2,022건)', foodLow: '우동 체인 하나마루 ¥500~', note: '모단야키 ¥950', noteLow: '우메다역 근처 체인', mapQuery: 'お好み焼きじ本店 新梅田食道街', mapQueryLow: 'はなまるうどん 梅田' },
      { time: '14:00~15:00', food: '산쿠 라멘 (3.75/2,518건)', note: '후쿠시마, 우메다 옆', mapQuery: '烈志笑魚油 麺香房 三く' },
      { time: '16:00~16:30', place: '난바 야사카 신사', note: '거대 사자머리 포토', mapQuery: '難波八阪神社' },
      { time: '17:00~17:30', place: '호젠지 요코쵸 산책', food: '메오토젠자이', note: '커플 기원', mapQuery: '法善寺横丁' },
      { time: '18:30~19:00', place: '도톤보리 리버크루즈', note: '주유패스 무료', mapQuery: 'とんぼりリバークルーズ' },
      { time: '19:30~', food: '후쿠타로 오코노미야키 (3.72/2,521건)', foodLow: '편의점+도톤보리 길거리음식 ¥800~', foodHigh: '야키니쿠 캇포 YP (3.57/425건) ¥10,000~', note: '우라난바', noteLow: '도톤보리 산책하며 간식', noteHigh: '고급 야키니쿠, 예약 필수', mapQuery: '福太郎本店 なんば', mapQueryLow: '道頓堀', mapQueryHigh: '焼肉割烹YP なんば' },
    ],
  },
  {
    id: 'O5',
    title: 'Day 5',
    subtitle: '로컬 체험 데이',
    theme: '스미요시타이샤 → 신세카이 → 스파월드',
    area: '남남',
    transport: '한카이 전차 1일권 (¥700) + ICOCA',
    transportLow: 'ICOCA 충전 (도보 + 메트로)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '09:00~10:30', place: '스미요시타이샤 참배', note: '한카이 전차(노면전차)', mapQuery: '住吉大社' },
      { time: '11:00~12:00', place: '텐노지 복귀', note: '노면전차 자체가 체험' },
      { time: '12:00~13:00', food: '야에카츠 쿠시카츠 (3.50/1,956건)', foodLow: '다루마 쿠시카츠 (3.46) ¥1,500~', note: '신세카이', noteLow: '신세카이, O2 재방문', mapQuery: '八重勝 新世界', mapQueryLow: '元祖串かつだるま新世界総本店' },
      { time: '14:00~16:30', place: '스파월드 (온천+암반욕)', note: '피로 회복', noteLow: '스킵 가능, 텐노지 공원 산책 (무료)', mapQuery: 'スパワールド世界の大温泉' },
      { time: '17:30~', food: '야키니쿠 키탄 호젠지 (3.60/571건)', foodLow: '편의점+이자카야 체인 ¥1,500~', foodHigh: '야키니쿠 키탄 프리미엄 코스 ¥15,000~', note: '전석 개인실, 예약 추천', noteLow: '난바역 근처 와타미/토리키조쿠', noteHigh: '특선 와규 코스, 예약 필수', mapQuery: '焼肉きたん法善寺', mapQueryLow: '和民 なんば' },
    ],
  },
  {
    id: 'O6',
    title: 'Day 6',
    subtitle: '나라 or 유카타 체험',
    theme: '옵션 A: 나라 당일치기 / 옵션 B: 유카타 체험',
    area: '근교 or 체험',
    transport: 'ICOCA',
    transportLow: 'ICOCA 충전 (도보 + 메트로)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '08:30~09:10', place: '난바 → 킨테츠 나라', note: '왕복 ¥1,120' },
      { time: '09:30~11:30', place: '나라공원 + 도다이지', note: '사슴 센베이 ¥150', mapQuery: '奈良公園 東大寺' },
      { time: '11:30~13:00', place: '카스가타이샤', food: '나라 상점가 점심', foodLow: '편의점 도시락 ¥500~700', foodHigh: '나라 료칸 런치 코스 ¥5,000~', noteLow: '나라역 근처 편의점', noteHigh: '나라 호텔 메인 다이닝, 예약 추천', mapQuery: '春日大社', mapQueryLow: 'ファミリーマート 近鉄奈良駅前', mapQueryHigh: '奈良ホテル メインダイニングルーム 三笠' },
      { time: '15:00~15:40', place: '오사카 복귀' },
      { time: '16:30~18:00', place: '나카노시마 미술관', note: '빨간 고양이 포토', mapQuery: '大阪中之島美術館' },
      { time: '19:00~', food: 'Dining 아지토 (3.51/515건)', foodLow: '편의점+도톤보리 길거리음식 ¥800~', foodHigh: '고급 이자카야 와규 코스 ¥10,000~', note: '우라난바 이자카야', noteLow: '도톤보리 산책하며 간식', noteHigh: '난바 고급 이자카야, 예약 필수', mapQuery: 'DININGあじと なんば', mapQueryLow: '道頓堀', mapQueryHigh: '難波 高級居酒屋 和牛' },
    ],
  },
]

export const usjDay: DayPlan = {
  id: 'USJ',
  title: 'USJ Day',
  subtitle: '테마파크 올인',
  theme: '유니버설 스튜디오 재팬',
  area: '서',
  transport: 'ICOCA (JR 유니버설시티역)',
  transportLow: 'ICOCA (JR 유니버설시티역)',
  transportHigh: '택시 자유 이용',
  slots: [
    { time: '08:00~21:00', place: '유니버설 스튜디오 재팬', note: '1데이 패스 ¥9,400~11,900/인', noteLow: '1데이 패스만, 파크 내 최소 지출', noteHigh: '1데이 패스 + 익스프레스 패스 ¥6,000~15,000/인', mapQuery: 'ユニバーサル・スタジオ・ジャパン' },
  ],
}

// ─── Kyoto Days ───

export const kyotoDays: DayPlan[] = [
  {
    id: 'K1',
    title: '교토 Day 1',
    subtitle: '교토의 정수',
    theme: '기요미즈데라 → 산넨자카 → 기온 → 폰토초',
    area: '히가시야마→기온',
    transport: '한큐 1일 패스 (¥700)',
    transportLow: 'ICOCA 충전 (도보 + 버스)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '08:00~09:00', place: '오사카 → 교토 이동', note: '한큐 ¥400 or 게이한 ¥420' },
      { time: '09:00~10:30', place: '기요미즈데라', note: '입장 ¥500, 세계유산', mapQuery: '清水寺' },
      { time: '10:30~12:00', place: '산넨자카·니넨자카 산책', note: '야사카탑 포토', mapQuery: '三年坂 二年坂' },
      { time: '12:00~13:30', food: '난젠지 준세이 유도후 (3.53/767건)', foodLow: '편의점 or 기온 우동 ¥500~800', foodHigh: '준세이 특별 코스 유바 카이세키 ¥5,500~', note: '하나 코스 ¥3,630', noteLow: '기온 시조 근처 체인', noteHigh: '정원 뷰 특별석, 예약 추천', mapQuery: '南禅寺順正', mapQueryLow: 'うどん 祇園四条', mapQueryHigh: '南禅寺順正' },
      { time: '14:00~14:30', place: '하나미코지 거리', note: '마이코를 만날 수도', mapQuery: '花見小路通' },
      { time: '14:30~15:00', place: '야사카 신사', note: '무료, 연인 기원', mapQuery: '八坂神社' },
      { time: '15:00~16:00', food: '사료 츠지리 말차 파르페 (3.55/1,058건)', foodLow: '츠지리 1층 테이크아웃 말차 소프트 ¥400', note: '대기 30분+', noteLow: '대기 없이 테이크아웃', mapQuery: '茶寮都路里 祇園本店' },
      { time: '16:00~17:00', place: '숙소 체크인' },
      { time: '18:00~20:00', place: '폰토초', food: '이카리야 식당 가와도코 (3.59/186건⚠️)', foodLow: '기온 소바 마츠바 ¥1,000~', foodHigh: '기온 니시카와 카이세키 ¥20,000+', note: '5월 강변 테라스, 예약 필수', noteLow: '니신소바 명물, 워크인 가능', noteHigh: '미슐랭 2스타, 완전 예약제', mapQuery: '先斗町 イカリヤ食堂', mapQueryLow: '祇園 にしんそば 松葉', mapQueryHigh: '祇園にしかわ' },
      { time: '20:00~', place: '가모가와 강변 야경 산책', mapQuery: '鴨川 先斗町' },
    ],
  },
  {
    id: 'K2',
    title: '교토 Day 2',
    subtitle: '천 개의 토리이와 대나무숲',
    theme: '후시미 이나리 → 아라시야마 → 오사카 복귀',
    area: '남→서',
    transport: 'JR + ICOCA',
    transportLow: 'ICOCA 충전 (JR + 메트로)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '07:00~09:00', place: '후시미 이나리 타이샤', note: '센본토리이, 무료', mapQuery: '伏見稲荷大社' },
      { time: '09:00~09:30', place: '이동 → 아라시야마', note: 'JR ~30분' },
      { time: '09:30~10:30', place: '아라시야마 대나무숲', note: '오전 일찍 = 독점', mapQuery: '嵐山竹林の小径' },
      { time: '10:30~11:00', place: '도게츠교 산책', food: '% 아라비카 카페라떼 (3.58/509건)', mapQuery: '渡月橋' },
      { time: '11:30~12:30', food: '아라시야마 요시무라 소바 (3.51/985건)', foodLow: '아라시야마 편의점 도시락 ¥500~700', note: '도게츠교 뷰, 도게츠젠 ¥1,500', noteLow: '공원에서 도시락', mapQuery: '嵐山よしむら', mapQueryLow: 'ファミリーマート 嵐山' },
      { time: '13:00~13:30', place: '아라시야마 기념품 쇼핑' },
      { time: '14:00~15:00', place: '교토 → 오사카 복귀', note: 'JR or 한큐 ~40분' },
      { time: '15:30~17:30', place: '신사이바시 쇼핑 or 자유 시간', note: '오사카 복귀 후', mapQuery: '心斎橋筋商店街' },
      { time: '18:00~', food: '후쿠타로 오코노미야키 (3.72/2,521건) or 도톤보리 자유 식사', foodLow: '편의점 ¥500~700', foodHigh: '야키니쿠 키탄 호젠지 (3.60) ¥8,000~', note: '우라난바', noteLow: '숙소 근처 편의점', noteHigh: '고급 야키니쿠, 예약 추천', mapQuery: '福太郎本店 なんば', mapQueryLow: 'セブンイレブン なんば', mapQueryHigh: '焼肉きたん法善寺' },
    ],
  },
  {
    id: 'K3',
    title: '교토 Day 3',
    subtitle: '금각사와 난젠지',
    theme: '텐류지 → 금각사 → 니시키 → 난젠지 → 오사카',
    area: '서→북서→동',
    transport: '교토 지하철+버스 1일권 (¥1,100)',
    transportLow: 'ICOCA 충전 (버스 + 도보)',
    transportHigh: '택시 자유 이용',
    slots: [
      { time: '08:30~09:00', place: '텐류지 정원', note: '세계유산, ¥500', mapQuery: '天龍寺' },
      { time: '09:00~09:30', place: '대나무숲 (아침의 고요함)', mapQuery: '嵐山竹林の小径' },
      { time: '10:00~10:40', place: '이동 → 금각사', note: '버스 ~40분' },
      { time: '10:40~11:30', place: '금각사', note: '¥500, 수면 반사', mapQuery: '金閣寺' },
      { time: '12:00~12:40', place: '이동 → 가와라마치', note: '버스 ~40분' },
      { time: '12:40~13:30', food: '미마스야 오쿠도한 오반자이 (3.47/447건)', foodLow: '니시키 시장 길거리음식 ¥500~800', foodHigh: '기온 료리 코스 ¥8,000~', note: '9종 오반자이+가마솥밥 ¥1,360', noteLow: '다시마키 타마고, 두유 도넛 등', noteHigh: '교토 전통 료리, 예약 필수', mapQuery: 'みます屋おくどはん', mapQueryLow: '錦市場', mapQueryHigh: '祇園 料理 コース' },
      { time: '13:30~15:00', place: '니시키 시장 → 기온', food: '기온 코모리 (3.67/1,458건)', note: '와라비모찌 파르페', mapQuery: 'ぎをん小森' },
      { time: '15:00~16:30', place: '난젠지 + 수로각', note: '포토스팟', mapQuery: '南禅寺 水路閣' },
      { time: '17:00~', place: '교토 → 오사카 복귀', food: '야마모토만보 (3.69/1,285건) or 다이이치아사히 (3.77/6,672건)', foodLow: '다이이치아사히 라멘 ¥950', foodHigh: '교토역 이세탄 11F 고급 레스토랑 ¥10,000~', note: '교토역 도보 7분', noteLow: '이미 저가, 특제 라멘 추천', noteHigh: '교토역 이세탄 백화점 내 고급 다이닝', mapQuery: '山本まんぼ 京都', mapQueryLow: '本家第一旭 京都駅', mapQueryHigh: '京都伊勢丹 レストラン 11階' },
    ],
  },
]

// ─── Budget ───

export const dailyBudget: BudgetRow[] = [
  { category: '숙소', low: '₩56,400', mid: '₩141,000', high: '₩423,000' },
  { category: '식비', low: '₩37,600', mid: '₩84,600', high: '₩258,500' },
  { category: '교통', low: '₩8,460', mid: '₩16,920', high: '₩42,300' },
  { category: '관광/체험', low: '₩4,700', mid: '₩23,500', high: '₩94,000' },
  { category: '쇼핑/기타', low: '₩18,800', mid: '₩51,700', high: '₩188,000' },
]

export const dailyTotal = { low: 126000, mid: 318000, high: 1006000 }
export const usjCost = { low: 180000, mid: 210000, high: 300000 }
export const kyotoDailyCost = { low: 130000, mid: 320000, high: 1010000 }
export const airportTransport = 48500

export function calcBudget(osakaNights: number, usj: boolean, kyotoNights: number) {
  const totalNights = osakaNights + (usj ? 1 : 0) + kyotoNights
  const totalDays = totalNights + 1
  const kyotoDayCount = kyotoNights > 0 ? kyotoNights + 1 : 0
  const baseDays = totalDays - kyotoDayCount - (usj ? 1 : 0) // 순수 오사카 일수
  return {
    low: baseDays * dailyTotal.low + (usj ? usjCost.low : 0) + kyotoDayCount * kyotoDailyCost.low + airportTransport,
    mid: baseDays * dailyTotal.mid + (usj ? usjCost.mid : 0) + kyotoDayCount * kyotoDailyCost.mid + airportTransport,
    high: baseDays * dailyTotal.high + (usj ? usjCost.high : 0) + kyotoDayCount * kyotoDailyCost.high + airportTransport,
    totalNights,
    totalDays,
  }
}

// ─── Restaurants ───

export const osakaRestaurants: Restaurant[] = [
  { name: '이마이 우동', nameJa: '道頓堀 今井', category: '우동', area: '도톤보리', tabelog: 3.58, reviews: 2266, price: '¥1,000~1,500', reservation: '예약 추천', recommended: '키츠네 우동 ¥930', day: 'O1' },
  { name: '하나다코', nameJa: 'はなだこ', category: '타코야키', area: '우메다', tabelog: 3.68, reviews: 2806, price: '~¥1,000', reservation: '테이크아웃', recommended: '네기마요 ¥650', day: 'O1' },
  { name: 'CENTRE M', nameJa: 'サントル エム', category: '카페', area: '니시신사이바시', tabelog: 3.55, reviews: 426, price: '¥2,000~3,000', reservation: '예약 추천', recommended: '아프타눈티 세트', day: 'O1' },
  { name: '미츠노', nameJa: '美津の', category: '오코노미야키', area: '도톤보리', tabelog: 3.56, reviews: 1628, price: '¥1,000~2,000', reservation: '워크인', recommended: '야마이모야키 ¥1,150', day: 'O2' },
  { name: '다루마', nameJa: '元祖串かつ だるま', category: '쿠시카츠', area: '신세카이', tabelog: 3.46, reviews: 1161, price: '¥2,000~3,000', reservation: '워크인', recommended: '소고기 쿠시카츠', day: 'O2' },
  { name: '와나카', nameJa: 'わなか', category: '타코야키', area: '도톤보리', tabelog: 3.49, reviews: 793, price: '~¥1,000', reservation: '테이크아웃', recommended: '오오이리 4종 세트 ¥750', day: 'O2' },
  { name: '코가류', nameJa: '甲賀流', category: '타코야키', area: '아메리카무라', tabelog: 3.46, reviews: 1403, price: '~¥1,000', reservation: '테이크아웃', recommended: '소스마요 ¥600', day: 'O3' },
  { name: '히데조 스시', nameJa: '鮨 ひでぞう', category: '스시', area: '난바', tabelog: 3.64, reviews: 399, price: '¥3,000~4,000', reservation: '예약 추천', recommended: '제철 네타', day: 'O3', warning: true },
  { name: 'hannoc', nameJa: 'ハノック', category: '카페/케이크', area: '나카자키쵸', tabelog: 3.61, reviews: 800, price: '¥1,000~2,000', reservation: '워크인', recommended: '시즌 프루츠 타르트', day: 'O4' },
  { name: '밀향야', nameJa: '蜜香屋', category: '디저트/카페', area: '나카자키쵸', tabelog: 3.55, reviews: 393, price: '~¥1,000', reservation: '워크인', recommended: '야키이모, 고구마 파르페', day: 'O4', warning: true },
  { name: '키지 본점', nameJa: 'お好み焼 きじ', category: '오코노미야키', area: '우메다', tabelog: 3.67, reviews: 2022, price: '¥1,500~3,000', reservation: '워크인', recommended: '모단야키 ¥950', day: 'O4' },
  { name: '산쿠 라멘', nameJa: '麺香房 三く', category: '라멘', area: '후쿠시마', tabelog: 3.75, reviews: 2518, price: '¥1,000~1,500', reservation: '워크인', recommended: '니쿠카케 ¥1,200', day: 'O4' },
  { name: '후쿠타로', nameJa: '福太郎', category: '오코노미야키', area: '우라난바', tabelog: 3.72, reviews: 2521, price: '¥2,000~3,000', reservation: '워크인', recommended: '넨리키야키 ¥1,300', day: 'O4' },
  { name: '야에카츠', nameJa: '八重勝', category: '쿠시카츠', area: '신세카이', tabelog: 3.50, reviews: 1956, price: '¥2,000~4,000', reservation: '워크인', recommended: '규헤레(소 안심)', day: 'O5' },
  { name: '야키니쿠 키탄', nameJa: '焼肉 きたん 法善寺', category: '야키니쿠', area: '호젠지', tabelog: 3.60, reviews: 571, price: '¥8,000~10,000', reservation: '예약 추천', recommended: '호젠지 코스 12품', day: 'O5' },
  { name: 'Dining 아지토', nameJa: 'DININGあじと', category: '이자카야', area: '우라난바', tabelog: 3.51, reviews: 515, price: '¥2,000~4,000', reservation: '예약 추천', recommended: '로스트비프, 지역 사케', day: 'O6' },
]

export const kyotoRestaurants: Restaurant[] = [
  { name: '준세이 유도후', nameJa: '南禅寺 順正', category: '유도후', area: '난젠지', tabelog: 3.53, reviews: 767, price: '¥3,300~5,500', reservation: '예약 추천', recommended: '하나 코스 ¥3,630', day: 'K1' },
  { name: '사료 츠지리', nameJa: '茶寮都路里', category: '말차 디저트', area: '기온', tabelog: 3.55, reviews: 1058, price: '¥1,400~1,700', reservation: '워크인', recommended: '특선 츠지리 파르페 ¥1,694', day: 'K1' },
  { name: '이카리야 식당', nameJa: 'イカリヤ食堂', category: '비스트로/가와도코', area: '가와라마치', tabelog: 3.59, reviews: 186, price: '¥3,000~4,000', reservation: '예약 필수', recommended: '런치 코스, 가와도코 디너', day: 'K1', warning: true },
  { name: '% 아라비카', nameJa: 'アラビカ京都 嵐山', category: '카페', area: '아라시야마', tabelog: 3.58, reviews: 509, price: '~¥1,000', reservation: '테이크아웃', recommended: '카페 라떼 ¥550', day: 'K2' },
  { name: '요시무라 소바', nameJa: '嵐山よしむら', category: '소바', area: '아라시야마', tabelog: 3.51, reviews: 985, price: '¥1,000~2,000', reservation: '워크인', recommended: '도게츠젠(소바+텐동) ¥1,500', day: 'K2' },
  { name: '오쿠도한', nameJa: 'みます屋 おくどはん', category: '오반자이', area: '가와라마치', tabelog: 3.47, reviews: 447, price: '~¥1,500', reservation: '예약 추천', recommended: '오쿠도한 고젠 ¥1,360', day: 'K3' },
  { name: '기온 코모리', nameJa: 'ぎをん 小森', category: '감미처', area: '기온', tabelog: 3.67, reviews: 1458, price: '¥1,000~2,000', reservation: '워크인', recommended: '와라비모찌 파르페', day: 'K3' },
  { name: '야마모토만보', nameJa: '山本まんぼ', category: '오코노미야키', area: '교토역', tabelog: 3.69, reviews: 1285, price: '¥1,000~2,000', reservation: '워크인', recommended: '만보야키 스페셜 ¥1,200', day: 'K3' },
  { name: '다이이치아사히', nameJa: '本家 第一旭', category: '라멘', area: '교토역', tabelog: 3.77, reviews: 6672, price: '~¥1,000', reservation: '워크인', recommended: '특제 라멘 ¥950', day: 'K3' },
]

// ─── Street Food ───

export const streetFood = {
  osaka: [
    { name: '타코야키', price: '¥500~700', where: '와나카, 코가류, 하나다코' },
    { name: '551 호라이 돼지만두', price: '¥230(2개)', where: '난바역, 우메다역' },
    { name: '리쿠로 치즈케이크', price: '¥965(1호)', where: '난바 본점' },
    { name: '츠리가네 만쥬', price: '¥179', where: '신세카이' },
  ],
  kyoto: [
    { name: '다시마키 타마고', price: '~¥500', where: '니시키 시장' },
    { name: '두유 미니 도넛', price: '~¥300', where: '니시키 시장' },
    { name: '말차 퐁뒤 당고', price: '~¥600', where: '니시키 시장' },
    { name: '와규 고로케', price: '~¥300', where: '니시키 시장' },
  ],
}
