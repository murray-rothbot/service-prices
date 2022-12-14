import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IBitgetTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class BitgetRepository implements ITickerRepository {
  source = 'Bitget'
  baseUrl = 'https://api.bitget.com/api/spot/v1'

  tickers = {
    BTCUSD: 'BTCUSDT',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const ticker = this.tickers[symbol.toUpperCase()] || symbol.toUpperCase()
    const url = `${this.baseUrl}/market/ticker?symbol=${ticker}_SPBL`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IBitgetTicker>): TickerResponseDto => {
          const { close, symbol } = response.data.data
          return { price: close, symbol, source: this.source }
        }),
        catchError(async () => {
          // TODO: Log errordto
          return null
        }),
      ),
    )
  }
}
