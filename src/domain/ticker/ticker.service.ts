import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TickerRequestDto, TickerResponseDto, TickersResponseDto } from './dto'
import { ITickerRepository } from './interfaces'

import {
  BinanceRepository,
  BitfinexRepository,
  BitgetRepository,
  BitstampRepository,
  CoinbaseRepository,
  GateIORepository,
  KrakenRepository,
  KuCoinRepository,
  MercadoBitcoinRepository,
  OKXRepository,
} from './repositories'

@Injectable()
export class TickerService {
  repositories: Array<ITickerRepository>

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly binanceRepository?: BinanceRepository,
    private readonly bitfinexRepository?: BitfinexRepository,
    private readonly bitgetRepository?: BitgetRepository,
    private readonly bitstampRepository?: BitstampRepository,
    private readonly coinbaseRepository?: CoinbaseRepository,
    private readonly gateioRepository?: GateIORepository,
    private readonly krakenRepository?: KrakenRepository,
    private readonly kucoinRepository?: KuCoinRepository,
    private readonly mercadoBitcoinRepository?: MercadoBitcoinRepository,
    private readonly okxRepository?: OKXRepository,
  ) {
    this.repositories = [
      this.binanceRepository,

      this.bitfinexRepository, // No BRL data
      this.bitstampRepository, // No BRL data
      this.gateioRepository, // No BRL data
      this.okxRepository, // No BRL data

      this.coinbaseRepository, // No 24 change data
      this.kucoinRepository, // No 24 change data
      this.bitgetRepository, // No 24 change data

      this.krakenRepository, // No BRL data, no 24 change data
      this.mercadoBitcoinRepository, // No USD data, no 24 change data
    ].filter((repo) => repo != null)
  }

  async getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    for (let repository of this.repositories) {
      try {
        const key = `${repository.source}_${symbol}`
        let data: TickerResponseDto = await this.cacheManager.get(key)
        if (!data) data = await repository.getTicker({ symbol })

        if (data) return data
      } catch {}
    }

    throw new Error()
  }

  async getTickers({ symbol }: TickerRequestDto): Promise<TickersResponseDto> {
    const promises = this.repositories.map(
      async (repository: ITickerRepository): Promise<TickerResponseDto> => {
        let data: TickerResponseDto = await this.cacheManager.get(`${repository.source}_${symbol}`)
        if (!data) data = await repository.getTicker({ symbol })
        return data
      },
    )

    const tickers = (await Promise.all(promises)).filter((ticker) => ticker != null)

    return { tickers }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateCache() {
    const symbols = ['btcusd', 'btcbrl']

    for (const symbol of symbols) {
      const promises = this.repositories.map(
        async (repository: ITickerRepository): Promise<TickerResponseDto> => {
          return await repository.getTicker({ symbol })
        },
      )

      const tickers = (await Promise.all(promises)).filter((ticker) => ticker != null)
      for (const ticker of tickers) {
        const key = `${ticker.source}_${symbol}`
        await this.cacheManager.set(key, ticker, 0)
      }
    }
  }
}
