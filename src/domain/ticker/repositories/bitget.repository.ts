import { Injectable } from '@nestjs/common'
import { IBitgetTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class BitgetRepository extends CacheRepository {
  source = 'Bitget'
  baseUrl = 'https://api.bitget.com/api/spot/v1'

  getTickerCode(symbol: string): string {
    const tickers = {
      BTCUSD: 'BTCUSDT',
    }

    return tickers[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  getTickerURL(ticker: string): string {
    return `${this.baseUrl}/market/ticker?symbol=${ticker}_SPBL`
  }

  repositoryToPrice(data: IBitgetTicker) {
    const { close } = data.data

    return { price: close }
  }
}
