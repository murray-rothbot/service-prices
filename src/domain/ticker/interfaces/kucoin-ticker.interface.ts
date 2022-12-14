export type IKuCoinTicker = {
  code: string
  data: {
    time: string
    sequence: string
    price: string
    size: string
    bestBid: string
    bestBidSize: string
    bestAsk: string
    bestAskSize: string
  }
}
