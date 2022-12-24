import { Injectable } from '@nestjs/common'
import { IKrakenTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class KrakenRepository extends CacheRepository {
  source = 'Kraken'
  baseUrl = 'https://api.kraken.com/0/public'

  getTickerCode(symbol: string): string {
    const tickers = {
      BTCUSD: 'TBTCUSD',
    }

    return tickers[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  getTickerURL(ticker: string): string {
    if (ticker.toUpperCase().includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/Ticker?pair=${ticker}`
  }

  repositoryToPrice(data: IKrakenTicker) {
    const price = data.result[Object.keys(data.result)[0]].c[0]

    return { price }
  }
}
