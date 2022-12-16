import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { TickerRequestDto, TickerResponseDto } from './../dto'
import { TickerController } from './../ticker.controller'
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

const RepositoryMock = {
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
          useValue: RepositoryMock,
        },
        {
          provide: BitfinexRepository,
          useValue: RepositoryMock,
        },
        {
          provide: BitgetRepository,
          useValue: RepositoryMock,
        },
        {
          provide: BitstampRepository,
          useValue: RepositoryMock,
        },
        {
          provide: CoinbaseRepository,
          useValue: RepositoryMock,
        },
        {
          provide: GateIORepository,
          useValue: RepositoryMock,
        },
        {
          provide: KrakenRepository,
          useValue: RepositoryMock,
        },
        {
          provide: KuCoinRepository,
          useValue: RepositoryMock,
        },
        {
          provide: MercadoBitcoinRepository,
          useValue: RepositoryMock,
        },
        {
          provide: OKXRepository,
          useValue: RepositoryMock,
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
