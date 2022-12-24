import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'
import { Cache } from 'cache-manager'

@Injectable()
export abstract class CacheRepository implements ITickerRepository {
  source = ''
  baseUrl: string = ''

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly httpService: HttpService,
  ) {}

  getTickerCode(symbol: string): string {
    return symbol
  }

  abstract getTickerURL(ticker: string): string

  abstract repositoryToPrice(data: any): { price: any; change24h?: any }

  async getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const cache_key = `${this.source}_${symbol}`

    // Try to find in cache
    let data: TickerResponseDto = await this.cacheManager.get(cache_key)
    if (data) return data

    try {
      // Not found. Retrieve from repository
      const ticker = this.getTickerCode(symbol)
      const url = this.getTickerURL(ticker)

      data = await lastValueFrom(
        this.httpService.get(url).pipe(
          map((response: AxiosResponse<any>): TickerResponseDto => {
            const { price, change24h } = this.repositoryToPrice(response.data)
            return { price, change24h, source: this.source, symbol: ticker }
          }),
          catchError(async () => {
            console.error('ERROR', this.source, url)
            return null
          }),
        ),
      )

      // Save to cache
      await this.cacheManager.set(cache_key, data, 10000)

      return data
    } catch {}

    return null
  }
}
