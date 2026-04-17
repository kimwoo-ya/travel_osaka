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
      { time: '12:30~13:30', food: '道頓堀 今井 (3.58/2,266건) [우동]', foodLow: '마츠야 규동 ¥400~', foodHigh: '호텔 레스토랑 런치 코스 ¥3,000~', note: '키츠네 우동 ¥930', noteLow: '난바역 주변 체인', noteHigh: '숙소 근처 고급 런치', mapQuery: '道頓堀今井本店', mapQueryLow: '松屋 なんば', mapQueryHigh: 'スイスホテル南海大阪 レストラン' },
      { time: '13:30~15:00', place: '호텔 체크인', note: '난바/신사이바시 비즈니스호텔', noteLow: '난바 호스텔/게스트하우스', noteHigh: '스위소텔 난카이 or 콘래드 오사카' },
      { time: '15:00~17:00', place: '신사이바시스지 쇼핑', food: 'サントル エム (3.55/426건) [카페]', foodLow: '편의점 커피 ¥150', foodHigh: 'CENTRE M 아프타눈티 세트 ¥4,000~', mapQuery: 'サントル エム 心斎橋' },
      { time: '17:30~18:00', food: 'はなだこ (3.68/2,806건) [타코야키]', note: '신우메다 쇼쿠도가이', mapQuery: 'はなだこ 新梅田食道街' },
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
      { time: '11:30~12:30', food: '美津の (3.56/1,628건) [오코노미야키]', foodLow: '요시노야 규동 ¥500', foodHigh: '美津の (3.56/1,628건) [오코노미야키]', note: '야마이모야키 ¥1,150', noteLow: '도톤보리 체인', mapQuery: '美津の 道頓堀', mapQueryLow: '吉野家 道頓堀' },
      { time: '13:00~14:30', place: '신세카이 + 츠텐카쿠', note: '주유패스 무료', noteLow: '거리 산책만 (입장료 절약)', mapQuery: '通天閣' },
      { time: '14:30~15:30', food: '元祖串かつ だるま (3.46/1,161건) [쿠시카츠]', note: '소스 이중 찍기 금지!', mapQuery: '元祖串かつだるま新世界総本店' },
      { time: '16:00~17:30', place: '아베노하루카스 300 전망대', note: '일몰, 300m', noteLow: '전망대 스킵, 텐노지 공원 산책 (무료)', mapQuery: 'あべのハルカス ハルカス300' },
      { time: '18:30~', place: '도톤보리 야경 산책', food: 'わなか (3.49/793건) [타코야키]', foodHigh: '카니도라쿠 게요리 디너 ¥8,000~', note: '4종 맛비교 ¥750', noteHigh: '도톤보리 본점, 예약 필수', mapQuery: 'わなか 道頓堀', mapQueryHigh: 'かに道楽 道頓堀本店' },
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
      { time: '15:30~16:30', food: '甲賀流 (3.46/1,403건) [타코야키]', note: '아메리카무라, 소스마요 ¥600', mapQuery: '甲賀流本店 アメリカ村' },
      { time: '16:30~18:00', place: '신사이바시 쇼핑', mapQuery: '心斎橋筋商店街' },
      { time: '19:00~', food: '鮨 ひでぞう (3.64/399건) [스시]', foodLow: '회전초밥 쿠라스시 ¥1,000~1,500', foodHigh: '오마카세 스시 ¥15,000~', note: '카운터 4석, 예약 추천', noteLow: '난바역 근처 체인 회전초밥', noteHigh: '난바 고급 오마카세, 예약 필수', mapQuery: '鮨ひでぞう 難波', mapQueryLow: 'くら寿司 なんば', mapQueryHigh: '鮨 なんば おまかせ' },
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
      { time: '10:00~12:00', place: '나카자키쵸 레트로 카페 거리', food: '蜜香屋 (3.55/393건) [군고구마/카페] + ハノック (3.61/800건) [카페/케이크]', foodLow: '편의점 커피 ¥150', note: '고민가 카페 + 아트 케이크', noteLow: '카페 스킵, 거리 산책만', mapQuery: '中崎町カフェ', mapQueryLow: 'セブンイレブン 中崎町' },
      { time: '12:30~13:30', food: 'お好み焼 きじ (3.67/2,022건) [오코노미야키]', foodLow: '우동 체인 하나마루 ¥500~', note: '모단야키 ¥950', noteLow: '우메다역 근처 체인', mapQuery: 'お好み焼きじ本店 新梅田食道街', mapQueryLow: 'はなまるうどん 梅田' },
      { time: '14:00~15:00', food: '麺香房 三く (3.75/2,518건) [라멘]', note: '후쿠시마, 우메다 옆', mapQuery: '烈志笑魚油 麺香房 三く' },
      { time: '16:00~16:30', place: '난바 야사카 신사', note: '거대 사자머리 포토', mapQuery: '難波八阪神社' },
      { time: '17:00~17:30', place: '호젠지 요코쵸 산책', food: '메오토젠자이', note: '커플 기원', mapQuery: '法善寺横丁' },
      { time: '18:30~19:00', place: '도톤보리 리버크루즈', note: '주유패스 무료', mapQuery: 'とんぼりリバークルーズ' },
      { time: '19:30~', food: '福太郎 (3.72/2,521건) [오코노미야키]', foodLow: '편의점+도톤보리 길거리음식 ¥800~', foodHigh: '焼肉割烹YP (3.57/425건) [야키니쿠] ¥10,000~', note: '우라난바', noteLow: '도톤보리 산책하며 간식', noteHigh: '고급 야키니쿠, 예약 필수', mapQuery: '福太郎本店 なんば', mapQueryLow: '道頓堀', mapQueryHigh: '焼肉割烹YP なんば' },
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
      { time: '12:00~13:00', food: '八重勝 (3.50/1,956건) [쿠시카츠]', foodLow: '다루마 쿠시카츠 (3.46) ¥1,500~', note: '신세카이', noteLow: '신세카이, O2 재방문', mapQuery: '八重勝 新世界', mapQueryLow: '元祖串かつだるま新世界総本店' },
      { time: '14:00~16:30', place: '스파월드 (온천+암반욕)', note: '피로 회복', noteLow: '스킵 가능, 텐노지 공원 산책 (무료)', mapQuery: 'スパワールド世界の大温泉' },
      { time: '17:30~', food: '焼肉 きたん 法善寺 (3.60/571건) [야키니쿠]', foodLow: '편의점+이자카야 체인 ¥1,500~', foodHigh: '야키니쿠 키탄 프리미엄 코스 ¥15,000~', note: '전석 개인실, 예약 추천', noteLow: '난바역 근처 와타미/토리키조쿠', noteHigh: '특선 와규 코스, 예약 필수', mapQuery: '焼肉きたん法善寺', mapQueryLow: '和民 なんば' },
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
      { time: '19:00~', food: 'DININGあじと (3.51/515건) [이자카야]', foodLow: '편의점+도톤보리 길거리음식 ¥800~', foodHigh: '고급 이자카야 와규 코스 ¥10,000~', note: '우라난바 이자카야', noteLow: '도톤보리 산책하며 간식', noteHigh: '난바 고급 이자카야, 예약 필수', mapQuery: 'DININGあじと なんば', mapQueryLow: '道頓堀', mapQueryHigh: '難波 高級居酒屋 和牛' },
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
      { time: '12:00~13:30', food: '南禅寺 順正 (3.53/767건) [유도후]', foodLow: '편의점 or 기온 우동 ¥500~800', foodHigh: '준세이 특별 코스 유바 카이세키 ¥5,500~', note: '하나 코스 ¥3,630', noteLow: '기온 시조 근처 체인', noteHigh: '정원 뷰 특별석, 예약 추천', mapQuery: '南禅寺順正', mapQueryLow: 'うどん 祇園四条', mapQueryHigh: '南禅寺順正' },
      { time: '14:00~14:30', place: '하나미코지 거리', note: '마이코를 만날 수도', mapQuery: '花見小路通' },
      { time: '14:30~15:00', place: '야사카 신사', note: '무료, 연인 기원', mapQuery: '八坂神社' },
      { time: '15:00~16:00', food: '茶寮都路里 (3.55/1,058건) [말차 디저트]', foodLow: '츠지리 1층 테이크아웃 말차 소프트 ¥400', note: '대기 30분+', noteLow: '대기 없이 테이크아웃', mapQuery: '茶寮都路里 祇園本店' },
      { time: '16:00~17:00', place: '숙소 체크인' },
      { time: '18:00~20:00', place: '폰토초', food: 'イカリヤ食堂 (3.59/186건⚠️) [비스트로/가와도코]', foodLow: '기온 소바 마츠바 ¥1,000~', foodHigh: '기온 니시카와 카이세키 ¥20,000+', note: '5월 강변 테라스, 예약 필수', noteLow: '니신소바 명물, 워크인 가능', noteHigh: '미슐랭 2스타, 완전 예약제', mapQuery: '先斗町 イカリヤ食堂', mapQueryLow: '祇園 にしんそば 松葉', mapQueryHigh: '祇園にしかわ' },
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
      { time: '10:30~11:00', place: '도게츠교 산책', food: '% アラビカ京都 嵐山 (3.58/509건) [카페]', mapQuery: '渡月橋' },
      { time: '11:30~12:30', food: '嵐山よしむら (3.51/985건) [소바]', foodLow: '아라시야마 편의점 도시락 ¥500~700', note: '도게츠교 뷰, 도게츠젠 ¥1,500', noteLow: '공원에서 도시락', mapQuery: '嵐山よしむら', mapQueryLow: 'ファミリーマート 嵐山' },
      { time: '13:00~13:30', place: '아라시야마 기념품 쇼핑' },
      { time: '14:00~15:00', place: '교토 → 오사카 복귀', note: 'JR or 한큐 ~40분' },
      { time: '15:30~17:30', place: '신사이바시 쇼핑 or 자유 시간', note: '오사카 복귀 후', mapQuery: '心斎橋筋商店街' },
      { time: '18:00~', food: '福太郎 (3.72/2,521건) [오코노미야키] or 도톤보리 자유 식사', foodLow: '편의점 ¥500~700', foodHigh: '야키니쿠 키탄 호젠지 (3.60) ¥8,000~', note: '우라난바', noteLow: '숙소 근처 편의점', noteHigh: '고급 야키니쿠, 예약 추천', mapQuery: '福太郎本店 なんば', mapQueryLow: 'セブンイレブン なんば', mapQueryHigh: '焼肉きたん法善寺' },
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
      { time: '12:40~13:30', food: 'みます屋 おくどはん (3.47/447건) [오반자이]', foodLow: '니시키 시장 길거리음식 ¥500~800', foodHigh: '기온 료리 코스 ¥8,000~', note: '9종 오반자이+가마솥밥 ¥1,360', noteLow: '다시마키 타마고, 두유 도넛 등', noteHigh: '교토 전통 료리, 예약 필수', mapQuery: 'みます屋おくどはん', mapQueryLow: '錦市場', mapQueryHigh: '祇園 料理 コース' },
      { time: '13:30~15:00', place: '니시키 시장 → 기온', food: 'ぎをん 小森 (3.67/1,458건) [감미처]', note: '와라비모찌 파르페', mapQuery: 'ぎをん小森' },
      { time: '15:00~16:30', place: '난젠지 + 수로각', note: '포토스팟', mapQuery: '南禅寺 水路閣' },
      { time: '17:00~', place: '교토 → 오사카 복귀', food: '山本まんぼ (3.69/1,285건) [오코노미야키] or 本家 第一旭 (3.77/6,672건) [라멘]', foodLow: '다이이치아사히 라멘 ¥950', foodHigh: '교토역 이세탄 11F 고급 레스토랑 ¥10,000~', note: '교토역 도보 7분', noteLow: '이미 저가, 특제 라멘 추천', noteHigh: '교토역 이세탄 백화점 내 고급 다이닝', mapQuery: '山本まんぼ 京都', mapQueryLow: '本家第一旭 京都駅', mapQueryHigh: '京都伊勢丹 レストラン 11階' },
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

// ─── Restaurants & Street Food ───
// 데이터는 restaurants.json으로 분리됨
import restaurantsJson from './restaurants.json'

export const osakaRestaurants: Restaurant[] = restaurantsJson.osaka as Restaurant[]
export const kyotoRestaurants: Restaurant[] = restaurantsJson.kyoto as Restaurant[]
export const streetFood = restaurantsJson.streetFood
