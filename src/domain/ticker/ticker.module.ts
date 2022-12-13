import { Module } from '@nestjs/common'
import { TickerService } from './ticker.service'
import { TickerController } from './ticker.controller'
import { HttpModule } from '@nestjs/axios'
import { BinanceRepository } from './repositories/binance.repository'

@Module({
  controllers: [TickerController],
  imports: [HttpModule],
  providers: [TickerService, BinanceRepository],
})
export class TickerModule {}
