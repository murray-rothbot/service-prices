import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { ICoinbaseTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class CoinbaseRepository implements ITickerRepository {
  source = 'Coinbase'
  baseUrl = 'https://api.coinbase.com/v2'

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const currency = symbol.substring(3, 6)
    const url = `${this.baseUrl}/prices/spot?currency=${currency}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<ICoinbaseTicker>): TickerResponseDto => {
          const { base, currency, amount } = response.data.data
          return { price: amount, symbol: `${base}${currency}`, source: this.source }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
