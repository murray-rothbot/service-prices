import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IOKXTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class OKXRepository implements ITickerRepository {
  source = 'OKX'
  baseUrl = 'https://www.okx.com/api/v5'

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    let ticker = `${symbol.substring(0, 3)}-${symbol.substring(3, 6)}`

    const url = `${this.baseUrl}/market/tickers?instType=SWAP&uly=${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IOKXTicker>): TickerResponseDto => {
          const { last, instId, open24h } = response.data.data[0]
          const change24h = ((+last / +open24h - 1) * 100).toFixed(2)
          return { price: last, symbol: instId, source: this.source, change24h }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
