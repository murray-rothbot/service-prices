import { CacheModule, Module } from '@nestjs/common'
import { TickerService } from './ticker.service'
import { TickerController } from './ticker.controller'
import { HttpModule } from '@nestjs/axios'

import { BinanceRepository } from './repositories'
import { BitfinexRepository } from './repositories'
import { BitgetRepository } from './repositories'
import { BitstampRepository } from './repositories'
import { CoinbaseRepository } from './repositories'
import { GateIORepository } from './repositories'
import { KrakenRepository } from './repositories'
import { KuCoinRepository } from './repositories'
import { MercadoBitcoinRepository } from './repositories'
import { OKXRepository } from './repositories'

@Module({
  controllers: [TickerController],
  imports: [HttpModule, CacheModule.register()],
  providers: [
    TickerService,
    BinanceRepository,
    BitfinexRepository,
    BitgetRepository,
    BitstampRepository,
    CoinbaseRepository,
    GateIORepository,
    KrakenRepository,
    KuCoinRepository,
    MercadoBitcoinRepository,
    OKXRepository,
  ],
  exports: [TickerService],
})
export class TickerModule {}
