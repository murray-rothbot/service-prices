import { Injectable } from '@nestjs/common'
import { IMercadoBitcoinTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class MercadoBitcoinRepository extends CacheRepository {
  source = 'Mercado Bitcoin'
  baseUrl = 'https://www.mercadobitcoin.net'

  getTickerURL(ticker: string): string {
    if (!ticker.toUpperCase().includes('BRL')) {
      throw new Error(`${ticker} not available at ${this.source}`)
    }

    return `${this.baseUrl}/api/btc/ticker/`
  }

  repositoryToPrice(data: IMercadoBitcoinTicker) {
    const { last } = data.ticker
    return { price: last }
  }
}
