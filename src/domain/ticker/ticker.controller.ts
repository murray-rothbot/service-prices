import { Controller, Get, Query } from '@nestjs/common'
import { TickerService } from './ticker.service'
import { TickerRequestDto, TickerResponseDto } from './dto'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

@Controller('ticker')
@ApiTags('binance')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @ApiQuery({
    name: 'symbol',
    example: 'BTCBRL',
  })
  @ApiOkResponse({ type: TickerResponseDto })
  @Get('')
  async getTicker(@Query() params: TickerRequestDto): Promise<TickerResponseDto> {
    return this.tickerService.getTicker(params)
  }
}
