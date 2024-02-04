import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ConvertRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  value: number

  @ApiProperty({
    required: true,
    type: String,
    example: 'btc',
    description: 'Select a currency.',
    name: 'currency',
  })
  @IsString()
  @IsNotEmpty()
  currency: string
}
