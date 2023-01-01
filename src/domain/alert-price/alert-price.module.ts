import { AlertPriceController } from './alert-price.controller'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AlertPrice } from './alert-price.model'
import { AlertPriceService } from './alert-price.service'
import { TickerModule } from '../ticker/ticker.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [SequelizeModule.forFeature([AlertPrice]), HttpModule, TickerModule],
  providers: [AlertPriceService],
  controllers: [AlertPriceController],
})
export class AlertPriceModule {}
