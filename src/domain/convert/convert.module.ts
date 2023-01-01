import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConvertController } from './convert.controller'
import { ConvertService } from './convert.service'
import { TickerModule } from '../ticker/ticker.module'

@Module({
  controllers: [ConvertController],
  imports: [HttpModule, TickerModule],
  providers: [ConvertService],
})
export class ConvertModule {}
