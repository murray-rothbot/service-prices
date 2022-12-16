import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IBinanceTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class BinanceRepository implements ITickerRepository {
  source = 'Binance'
  baseUrl: string = 'https://api3.binance.com/api/v3'

  tickers = {
    BTCUSD: 'BTCUSDT',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const ticker = this.tickers[symbol.toUpperCase()] || symbol.toUpperCase()
    const url = `${this.baseUrl}/ticker?symbol=${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IBinanceTicker>): TickerResponseDto => {
          const { lastPrice, symbol, priceChangePercent } = response.data

          return {
            price: lastPrice,
            symbol: symbol,
            source: this.source,
            change24h: priceChangePercent,
          }
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
