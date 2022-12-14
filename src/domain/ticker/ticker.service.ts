import { Injectable } from '@nestjs/common'
import { TickerRequestDto, TickerResponseDto } from './dto'

import { BinanceRepository } from './repositories'
import { BitfinexRepository } from './repositories'
import { BitgetRepository } from './repositories'
import { BitstampRepository } from './repositories'
import { CoinbaseRepository } from './repositories'
import { GateIORepository } from './repositories'
import { KrakenRepository } from './repositories'
import { KuCoinRepository } from './repositories'
import { MercadoBitcoinRepository } from './repositories'
import { OKXRepository } from './repositories'

@Injectable()
export class TickerService {
  repositories: Array<any>

  constructor(
    private readonly binanceRepository: BinanceRepository,
    private readonly bitfinexRepository: BitfinexRepository,
    private readonly bitgetRepository: BitgetRepository,
    private readonly bitstampRepository: BitstampRepository,
    private readonly coinbaseRepository: CoinbaseRepository,
    private readonly gateioRepository: GateIORepository,
    private readonly krakenRepository: KrakenRepository,
    private readonly kucoinRepository: KuCoinRepository,
    private readonly mercadoBitcoinRepository: MercadoBitcoinRepository,
    private readonly okxRepository: OKXRepository,
  ) {
    this.repositories = [
      this.binanceRepository,
      this.bitgetRepository,
      this.coinbaseRepository,
      this.kucoinRepository,

      // No BRL data
      this.bitfinexRepository,
      this.bitstampRepository,
      this.gateioRepository,
      this.krakenRepository,
      this.okxRepository,

      // No BRL data
      this.mercadoBitcoinRepository,
    ]
  }

  async getTicker(params: TickerRequestDto): Promise<TickerResponseDto> {
    for (let repository of this.repositories) {
      try {
        const data = await repository.getTicker(params)
        if (data) return data
      } catch {}
    }

    throw new Error()
  }
}
