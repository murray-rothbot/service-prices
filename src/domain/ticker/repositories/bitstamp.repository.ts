import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IBitstampTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class BitstampRepository implements ITickerRepository {
  source: string = 'Bitstamp'
  baseUrl = 'https://www.bitstamp.net/api/v2'

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const url = `${this.baseUrl}/ticker/${symbol.toLowerCase()}/`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IBitstampTicker>): TickerResponseDto => {
          const { last, percent_change_24 } = response.data
          return { price: last, symbol, source: this.source, change24h: percent_change_24 }
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
