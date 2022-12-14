import { Controller, Get, Query } from '@nestjs/common'
import { ConvertService } from './convert.service'
import { ConvertRequestDto, ConvertResponseDto } from './dto'

@Controller('')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Get('/convert')
  async convert(@Query() params: ConvertRequestDto): Promise<ConvertResponseDto> {
    return await this.convertService.convert(params)
  }
}
