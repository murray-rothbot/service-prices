import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IMercadoBitcoinTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class MercadoBitcoinRepository implements ITickerRepository {
  source = 'Mercado Bitcoin'
  baseUrl = 'https://www.mercadobitcoin.net'

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    if (symbol.toLocaleUpperCase() != 'BTCBRL') {
      return null
    }

    const url = `${this.baseUrl}/api/btc/ticker/`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IMercadoBitcoinTicker>): TickerResponseDto => {
          const { last } = response.data.ticker
          return { price: last, symbol, source: this.source }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
