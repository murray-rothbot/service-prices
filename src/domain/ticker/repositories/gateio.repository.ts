import { Injectable } from '@nestjs/common'
import { IGateIOTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class GateIORepository extends CacheRepository {
  source = 'GateIO'
  baseUrl = 'https://api.gateio.ws/api/v4'

  getTickerCode(symbol): string {
    return `${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`
  }

  getTickerURL(ticker): string {
    if (ticker.toUpper().includes('BRL')) {
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
