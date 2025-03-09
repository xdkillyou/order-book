export enum PriceStatus {
  'Rising',
  'Falling',
  'Flat',
}

export interface IPriceData {
  symbol: string
  side: string
  size: number
  price: number
  tradeId: number
  timestamp: number
}

export interface IPriceWsResponse {
  topic: string
  data: IPriceData[]
}
