import { Injectable } from '@nestjs/common'
import { BinanceRepository } from './repositories/binance.repository'
import { TickerRequestDto, TickerResponseDto } from './dto'

@Injectable()
export class TickerService {
  constructor(private readonly repository: BinanceRepository) {}

  async getTicker(params: TickerRequestDto): Promise<TickerResponseDto> {
    const { lastPrice, symbol } = await this.repository.getTicker(params)
    return { lastPrice, symbol }
  }
}
