import { Controller, Post, Body } from '@nestjs/common'
import { AlertPriceService } from './alert-price.service'
import { CreateAlertPriceDto } from './dto/create-alert-price.dto'

@Controller('alert-price')
export class AlertPriceController {
  constructor(private readonly alertPriceService: AlertPriceService) {}

  @Post()
  create(@Body() createAlertPriceDto: CreateAlertPriceDto) {
    return this.alertPriceService.create(createAlertPriceDto)
  }
}
