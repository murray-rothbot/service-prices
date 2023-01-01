import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'

export class CreateAlertPriceDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  webhookUrl: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  currency: string
}
