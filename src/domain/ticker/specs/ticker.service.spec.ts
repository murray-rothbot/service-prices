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
import { CacheModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

describe('TickerService', () => {
  let service: TickerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register(), ConfigModule],
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
    }).compile()

    service = module.get<TickerService>(TickerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
