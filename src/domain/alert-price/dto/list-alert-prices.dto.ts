import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator'

export class ListAlertPricesDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  webhookUrl: string
}
