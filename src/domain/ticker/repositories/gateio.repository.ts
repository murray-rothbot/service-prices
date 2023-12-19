import { Injectable } from '@nestjs/common'
import { IGateIOTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class GateIORepository extends CacheRepository {
  source = 'GateIO'
  baseUrl = 'https://api.gateio.ws/api/v4'

  getTickerCode(symbol: string): string {
    const tickers = {
      BTCUSD: 'BTC_USDT',
    }
    return tickers[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  getTickerURL(ticker: string): string {
    if (ticker.toUpperCase().includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/spot/tickers?currency_pair=${ticker}`
  }

  repositoryToPrice(data: IGateIOTicker) {
    const { last, change_percentage } = data[0]

    return {
      price: last,
      change24h: change_percentage,
    }
  }
}
