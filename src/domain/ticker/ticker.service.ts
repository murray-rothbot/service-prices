import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { catchError, lastValueFrom, map } from 'rxjs'
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
  private readonly logger = new Logger(TickerService.name)

  constructor(
    protected readonly httpService: HttpService,
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
        return await repository.getTicker({ symbol })
      } catch {}
    }

    throw new Error()
  }

  async getTickers({ symbol }: TickerRequestDto): Promise<TickersResponseDto> {
    const promises = this.repositories.map(
      async (repository: ITickerRepository): Promise<TickerResponseDto> => {
        return await repository.getTicker({ symbol })
      },
    )

    const tickers = (await Promise.all(promises)).filter((ticker) => ticker != null)

    return { tickers }
  }

  @Cron('*/5 * * * * *')
  async updateCache() {
    const symbols = ['btcusd', 'btcbrl']
    for (const symbol of symbols) {
      this.repositories.map(async (repository: ITickerRepository): Promise<TickerResponseDto> => {
        return await repository.getTicker({ symbol })
      })
    }
  }

  // send a request to the endpoint every 5 minutes
  @Cron('*/10 * * * * *')
  async handleCron(): Promise<void> {
    const symbols = ['btcusd', 'btcbrl']
    const tickers = []
    for (const symbol of symbols) {
      tickers.push(await this.getTicker({ symbol }))
    }

    // send the tickers to the frontend endpoint webhook
    const webhookUrl = `${process.env.DISCORD_CLIENT_URL}/webhooks/new-price`
    await lastValueFrom(
      this.httpService.post(webhookUrl, tickers).pipe(
        map(() => {
          this.logger.debug(`POST WEBHOOK - ${webhookUrl}`)
        }),
        catchError(async () => {
          this.logger.error(`ERROR POST ${webhookUrl}`)
          return null
        }),
      ),
    )
  }
}
