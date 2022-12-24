import config from './config/env.config'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { CacheModule, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TickerModule } from './domain/ticker/ticker.module'
import { ConvertModule } from './domain/convert/convert.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),

    TickerModule,
    ConvertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
