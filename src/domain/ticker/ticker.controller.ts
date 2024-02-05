import { Controller, Get, Query } from '@nestjs/common'
import { TickerService } from './ticker.service'
import { TickerRequestDto, TickerResponseDto } from './dto'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { TickersResponseDto } from './dto/tickers-response.dto'

@Controller('')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @ApiOperation({
    summary: 'Provides data for a specific currency pair.',
  })
  @ApiQuery({
    name: 'symbol',
    example: 'BTCUSD',
    description: 'Choose a symbol to get the ticker.',
    examples: {
      BTCUSD: {
        summary: 'BTCUSD',
        value: 'BTCUSD',
      },
      BTCBRL: {
        summary: 'BTCBRL',
        value: 'BTCBRL',
      },
    },
  })
  @ApiTags('Tickers')
  @ApiOkResponse({ type: TickerResponseDto })
  @Get('/ticker')
  async getTicker(@Query() params: TickerRequestDto): Promise<TickerResponseDto> {
    return this.tickerService.getTicker(params)
  }

  @ApiOperation({
    summary: 'Returns information on multiple currency pairs.',
  })
  @ApiQuery({
    name: 'symbol',
    example: 'BTCUSD',
    examples: {
      BTCUSD: {
        summary: 'BTCUSD',
        value: 'BTCUSD',
      },
      BTCBRL: {
        summary: 'BTCBRL',
        value: 'BTCBRL',
      },
    },
  })
  @ApiTags('Tickers')
  @ApiOkResponse({ type: TickersResponseDto })
  @Get('/tickers')
  async getTickers(@Query() params: TickerRequestDto): Promise<TickersResponseDto> {
    return this.tickerService.getTickers(params)
  }
}
