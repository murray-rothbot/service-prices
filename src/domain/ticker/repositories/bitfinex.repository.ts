import { Injectable } from '@nestjs/common'
import { IBitfinexTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class BitfinexRepository extends CacheRepository {
  source = 'Bitfinex'
  baseUrl = 'https://api-pub.bitfinex.com/v2'

  getTickerCode(symbol): string {
    const tickers = {
      BTCUSD: 'tBTCUSD',
    }

    return tickers[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  getTickerURL(ticker): string {
    if (ticker.includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/ticker/${ticker}`
  }

  repositoryToPrice(data: IBitfinexTicker) {
    const price = `${data[9].toFixed(2)}`
    const change24h = `${(data[5] * 100).toFixed(2)}`

    return {
      price,
      change24h,
    }
  }
}
