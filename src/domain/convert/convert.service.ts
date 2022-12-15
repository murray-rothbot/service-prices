import { Injectable } from '@nestjs/common'
import { TickerService } from '../ticker/ticker.service'
import { ConvertRequestDto, ConvertResponseDto } from './dto'

@Injectable()
export class ConvertService {
  constructor(private readonly tickerService: TickerService) {}

  async convert({ value, currency }: ConvertRequestDto): Promise<ConvertResponseDto> {
    currency = currency.toLowerCase()

    const quotes = await Promise.all([
      this.tickerService.getTicker({ symbol: 'btcusd' }),
      this.tickerService.getTicker({ symbol: 'btcbrl' }),
    ])

    const btcUsd = +quotes[0].price
    const btcBrl = +quotes[1].price

    const toBtc = {
      btc: (value: number) => value,
      usd: (value: number) => value / btcUsd,
      brl: (value: number) => value / btcBrl,
      sat: (value: number) => value / 1e8,
    }

    if (!(currency in toBtc)) {
      throw new Error()
    }

    const btc: number = toBtc[currency](value)
    const usd: number = btc / toBtc['usd'](1)
    const brl: number = btc / toBtc['brl'](1)
    const sat: number = btc / toBtc['sat'](1)

    return {
      btc: btc.toFixed(8),
      usd: usd.toFixed(2),
      brl: brl.toFixed(2),
      sat: sat.toFixed(0),
    }
  }
}
