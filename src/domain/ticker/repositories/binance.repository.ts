import { Injectable } from '@nestjs/common'
import { IBinanceTicker } from '../interfaces'
import { CacheRepository } from './cache.repository'

@Injectable()
export class BinanceRepository extends CacheRepository {
  source = 'Binance'
  baseUrl: string = 'https://api3.binance.com/api/v3'

  getTickerCode(symbol: string): string {
    const tickers = {
      BTCUSD: 'BTCUSDT',
    }

    return tickers[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  getTickerURL(ticker: string): string {
    return `${this.baseUrl}/ticker?symbol=${ticker}`
  }

  repositoryToPrice(data: IBinanceTicker) {
    const { lastPrice, priceChangePercent } = data

    return {
      price: lastPrice,
      change24h: priceChangePercent,
    }
  }
}
