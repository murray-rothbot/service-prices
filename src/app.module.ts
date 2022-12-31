import config from './config/env.config'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TickerModule } from './domain/ticker/ticker.module'
import { ConvertModule } from './domain/convert/convert.module'
import { AlertPriceModule } from './domain/alert-price/alert-price.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { AlertPrice } from './domain/alert-price/alert-price.model'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [AlertPrice],
      autoLoadModels: true,
      logging: false,
    }),
    TickerModule,
    ConvertModule,
    AlertPriceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
