import { Controller, Get, Query } from '@nestjs/common'
import { TickerService } from './ticker.service'
import { TickerRequestDto, TickerResponseDto } from './dto'
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import { TickersResponseDto } from './dto/tickers-response.dto'

@Controller('')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @ApiQuery({
    name: 'symbol',
    example: 'BTCBRL',
  })
  @ApiOkResponse({ type: TickerResponseDto })
  @Get('/ticker')
  async getTicker(@Query() params: TickerRequestDto): Promise<TickerResponseDto> {
    return this.tickerService.getTicker(params)
  }

  @ApiQuery({
    name: 'symbol',
    example: 'BTCBRL',
  })
  @ApiOkResponse({ type: TickerResponseDto })
  @Get('/tickers')
  async getTickers(@Query() params: TickerRequestDto): Promise<TickersResponseDto> {
    return this.tickerService.getTickers(params)
  }
}
