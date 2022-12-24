import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { TickerRequestDto, TickerResponseDto, TickersResponseDto } from './../dto'
import { TickerController } from './../ticker.controller'
import { TickerService } from './../ticker.service'

const ServiceMock = {
  getTicker({ symbol }): TickerResponseDto {
    if (symbol === 'INVALID') {
      throw new Error()
    }

    return {
      price: '123456.78',
      symbol,
      source: 'Mock',
    }
  },

  getTickers({ symbol }): TickersResponseDto {
    if (symbol === 'INVALID') {
      throw new Error()
    }

    return {
      tickers: [
        {
          price: '123456.78',
          symbol,
          source: 'Mock 1',
        },
        {
          price: '123456.99',
          symbol,
          source: 'Mock 2',
        },
      ],
    }
  },
}

describe('TickerController', () => {
  let controller: TickerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickerController],
      providers: [
        {
          provide: TickerService,
          useValue: ServiceMock,
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
