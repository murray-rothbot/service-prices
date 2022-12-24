import { Injectable } from '@nestjs/common'
import { ICoinbaseTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class CoinbaseRepository extends CacheRepository {
  source = 'Coinbase'
  baseUrl = 'https://api.coinbase.com/v2'

  getTickerCode(symbol: string): string {
    return symbol.substring(3, 6)
  }

  getTickerURL(ticker: string): string {
    return `${this.baseUrl}/prices/spot?currency=${ticker}`
  }

  repositoryToPrice(data: ICoinbaseTicker) {
    const { amount } = data.data
    return { price: amount }
  }
}
