import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { TickerService } from './../ticker.service'

import { BinanceRepository } from './../repositories'
import { BitfinexRepository } from './../repositories'
import { BitgetRepository } from './../repositories'
import { BitstampRepository } from './../repositories'
import { CoinbaseRepository } from './../repositories'
import { GateIORepository } from './../repositories'
import { KrakenRepository } from './../repositories'
import { KuCoinRepository } from './../repositories'
import { MercadoBitcoinRepository } from './../repositories'
import { OKXRepository } from './../repositories'

describe('TickerService', () => {
  let service: TickerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TickerService,
        BinanceRepository,
        BitfinexRepository,
        BitgetRepository,
        BitstampRepository,
        CoinbaseRepository,
        GateIORepository,
        KrakenRepository,
        KuCoinRepository,
        MercadoBitcoinRepository,
        OKXRepository,
      ],
      imports: [HttpModule],
    }).compile()

    service = module.get<TickerService>(TickerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})