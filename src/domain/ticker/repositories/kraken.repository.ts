import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IKrakenTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class KrakenRepository implements ITickerRepository {
  source = 'Kraken'
  baseUrl = 'https://api.kraken.com/0/public'

  tickers = {
    BTCUSD: 'TBTCUSD',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const ticker = this.tickers[symbol.toUpperCase()] || symbol.toUpperCase()
    const url = `${this.baseUrl}/Ticker?pair=${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IKrakenTicker>): TickerResponseDto => {
          const price = response.data.result[ticker].c[0]
          return { price, symbol: ticker, source: this.source }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
