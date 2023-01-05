import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { AlertPriceService } from './alert-price.service'
import { CreateAlertPriceDto, ListAlertPricesDto } from './dto'

@Controller('alert-price')
export class AlertPriceController {
  constructor(private readonly alertPriceService: AlertPriceService) {}

  @Post()
  create(@Body() createAlertPriceDto: CreateAlertPriceDto) {
    return this.alertPriceService.create(createAlertPriceDto)
  }

  @Get()
  list(@Query() listAlertPricesDto: ListAlertPricesDto) {
    return this.alertPriceService.list(listAlertPricesDto)
  }
}
