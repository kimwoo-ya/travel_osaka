// ─── Confirmed Itinerary Types ───

export interface RestaurantInfo {
  nameJa?: string
  tabelog?: number
  reviews?: number
  price?: string
}

export interface ConfirmedSlot {
  time: string
  place: string
  category?: string
  note?: string
  mapUrl?: string
  restaurant?: RestaurantInfo
}

export interface Accommodation {
  name: string
  checkIn?: string
  checkOut?: string
  bookingUrl?: string
}

export interface ConfirmedDay {
  date: string
  dayNumber: number
  title: string
  theme?: string
  route?: string
  transport?: string
  slots: ConfirmedSlot[]
  accommodation?: Accommodation
}

export interface ConfirmedItinerary {
  title: string
  startDate: string
  endDate: string
  days: ConfirmedDay[]
}
