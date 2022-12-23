import { Injectable } from '@nestjs/common'
import { IKuCoinTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class KuCoinRepository extends CacheRepository {
  source = 'KuCoin'
  baseUrl = 'https://api.kucoin.com/api/v1'

  getTickerCode(symbol): string {
    const tickers = {
      BTCUSD: 'BTCUSDT',
    }
    const ticker = tickers[symbol.toUpperCase()] || symbol.toUpperCase()
    return `${ticker.substring(0, 3)}-${ticker.substring(3, ticker.length)}`
  }

  getTickerURL(ticker): string {
    return `${this.baseUrl}/market/orderbook/level1?symbol=${ticker}`
  }

  repositoryToPrice(data: IKuCoinTicker) {
    const { price } = data.data

    return { price }
  }
}
