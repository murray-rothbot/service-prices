import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config/env.config'
import { ConvertModule } from './domain/convert/convert.module'
import { TickerModule } from './domain/ticker/ticker.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TickerModule,
    ConvertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
