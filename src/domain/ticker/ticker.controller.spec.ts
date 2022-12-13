import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { TickerRequestDto, TickerResponseDto } from './dto'
import { BinanceRepository } from './repositories/binance.repository'
import { TickerController } from './ticker.controller'
import { TickerService } from './ticker.service'

const BinanceRepositoryMock = {
  getTicker({ symbol }) {
    if (symbol === 'INVALID') {
      throw new Error()
    }

    return {
      lastPrice: 10,
      symbol,
    }
  },
}

describe('TickerController', () => {
  let controller: TickerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickerController],
      providers: [
        TickerService,
        {
          provide: BinanceRepository,
          useValue: BinanceRepositoryMock,
        },
      ],
      imports: [HttpModule],
    }).compile()

    controller = module.get<TickerController>(TickerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('ticker', () => {
    for (let test_symbol of ['BTCBRL', 'BTCUSDT']) {
      it(`should return price for ${test_symbol}`, async () => {
        const request = new TickerRequestDto()
        request.symbol = test_symbol

        const response: TickerResponseDto = await controller.getTicker(request)
        expect(response.symbol).toBe(test_symbol)
      })
    }

    it(`invalid symbol should throw exception`, async () => {
      const request = new TickerRequestDto()
      request.symbol = 'INVALID'

      await expect(controller.getTicker(request)).rejects.toThrow()
    })
  })
})
