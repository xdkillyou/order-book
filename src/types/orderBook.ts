export type IOrderBookRow = [string, string] // price, amount

export interface IOrderBookData {
  asks: IOrderBookRow[]
  bids: IOrderBookRow[]
  prevSeqNum: number
  seqNum: number
  symbol: string
  timestamp: number
  type: string
}

export interface IOrderBookWsResponse {
  topic: string
  data: IOrderBookData
}
