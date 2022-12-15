import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ConvertRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  value: number

  @IsString()
  @IsNotEmpty()
  currency: string
}
