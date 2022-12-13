import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { BinanceRepository } from './repositories/binance.repository'
import { TickerService } from './ticker.service'

describe('TickerService', () => {
  let service: TickerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TickerService, BinanceRepository],
      imports: [HttpModule],
    }).compile()

    service = module.get<TickerService>(TickerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
