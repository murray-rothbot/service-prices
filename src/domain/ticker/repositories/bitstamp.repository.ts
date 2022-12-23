import { Injectable } from '@nestjs/common'
import { IBitstampTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class BitstampRepository extends CacheRepository {
  source: string = 'Bitstamp'
  baseUrl = 'https://www.bitstamp.net/api/v2'

  getTickerURL(ticker): string {
    if (ticker.toUpper().includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/ticker/${ticker.toLowerCase()}/`
  }

  repositoryToPrice(data: IBitstampTicker) {
    const { last, percent_change_24 } = data

    return {
      price: last,
      change24h: percent_change_24,
    }
  }
}
