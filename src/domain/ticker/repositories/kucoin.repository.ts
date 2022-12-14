import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IKuCoinTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class KuCoinRepository implements ITickerRepository {
  source = 'KuCoin'
  baseUrl = 'https://api.kucoin.com/api/v1'

  tickers = {
    BTCUSD: 'BTCUSDT',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    let ticker: string = this.tickers[symbol.toUpperCase()] || symbol.toUpperCase()
    ticker = `${ticker.substring(0, 3)}-${ticker.substring(3, ticker.length)}`

    const url = `${this.baseUrl}/market/orderbook/level1?symbol=${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<any>): TickerResponseDto => {
          const { price } = response.data.data
          return { price, symbol: ticker, source: this.source }
        }),
        catchError(async () => {
          // TODO: Log errordto
          console.error(url)
          return null
        }),
      ),
    )
  }
}
