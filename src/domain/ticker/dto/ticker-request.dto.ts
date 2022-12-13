import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TickerRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'BTCUSDT|BTCBRL',
    description: 'Ticker symbol',
    name: 'symbol',
  })
  @IsString()
  @IsNotEmpty()
  symbol: string
}
