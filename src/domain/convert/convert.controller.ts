import { Controller, Get, Query } from '@nestjs/common'
import { ConvertService } from './convert.service'
import { ConvertRequestDto, ConvertResponseDto } from './dto'
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@Controller('')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @ApiOperation({
    summary: ' Converts values between different currencies.',
  })
  @ApiQuery({
    name: 'currency',
    example: 'btc',
    examples: {
      btc: {
        summary: 'BTC',
        value: 'btc',
      },
      sat: {
        summary: 'SAT',
        value: 'sat',
      },
      usd: {
        summary: 'USD',
        value: 'usd',
      },
      brl: {
        summary: 'BRL',
        value: 'brl',
      },
    },
  })
  @ApiTags('Tickers')
  @ApiOkResponse({ type: ConvertResponseDto })
  @Get('/convert')
  async convert(@Query() params: ConvertRequestDto): Promise<ConvertResponseDto> {
    return await this.convertService.convert(params)
  }
}
