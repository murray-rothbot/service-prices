import { Injectable } from '@nestjs/common'
import { IOKXTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class OKXRepository extends CacheRepository {
  source = 'OKX'
  baseUrl = 'https://www.okx.com/api/v5'

  getTickerCode(symbol: string): string {
    return `${symbol.substring(0, 3)}-${symbol.substring(3, 6)}`
  }

  getTickerURL(ticker: string): string {
    if (ticker.toUpperCase().includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/market/tickers?instType=SWAP&uly=${ticker}`
  }

  repositoryToPrice(data: IOKXTicker) {
    const { last, open24h } = data.data[0]
    const change24h = ((+last / +open24h - 1) * 100).toFixed(2)

    return { price: last, change24h }
  }
}
