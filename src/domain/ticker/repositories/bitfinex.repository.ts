import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IBitfinexTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class BitfinexRepository implements ITickerRepository {
  source = 'Bitfinex'
  baseUrl = 'https://api-pub.bitfinex.com/v2'

  tickers = {
    BTCUSD: 'tBTCUSD',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const ticker = this.tickers[symbol.toUpperCase()] || symbol
    const url = `${this.baseUrl}/ticker/${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IBitfinexTicker>): TickerResponseDto => {
          const price = `$response.data[9]`
          return { price, symbol, source: this.source }
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
