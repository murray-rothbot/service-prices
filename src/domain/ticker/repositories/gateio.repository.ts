import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IGateIOTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class GateIORepository implements ITickerRepository {
  source = 'GateIO'
  baseUrl = 'https://api.gateio.ws/api/v4'

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    symbol = `${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`
    const url = `${this.baseUrl}/spot/tickers?currency_pair=${symbol}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IGateIOTicker>): TickerResponseDto => {
          const { currency_pair, last, change_percentage } = response.data[0]

          return {
            price: last,
            symbol: currency_pair,
            source: this.source,
            change24h: change_percentage,
          }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
