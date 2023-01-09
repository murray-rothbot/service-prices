import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { TickerService } from '../ticker/ticker.service'
import { AlertPrice } from './alert-price.model'
import { CreateAlertPriceDto, ListAlertPricesDto } from './dto'
import { HttpService } from '@nestjs/axios'
import { catchError, lastValueFrom, map } from 'rxjs'

@Injectable()
export class AlertPriceService {
  private readonly logger = new Logger(AlertPriceService.name)

  constructor(
    @InjectModel(AlertPrice)
    private alertPriceModel: typeof AlertPrice,
    private readonly tickerService: TickerService,
    protected readonly httpService: HttpService,
  ) {}

  async create(data: CreateAlertPriceDto): Promise<AlertPrice> {
    const ticker = await this.tickerService.getTicker({ symbol: `BTC${data.currency}` })
    const priceDifference = data.price - parseFloat(ticker.price)

    //check if alert is already created
    const alert = await this.alertPriceModel.findOne({
      where: {
        webhookUrl: data.webhookUrl,
        currency: data.currency,
        price: data.price,
        above: priceDifference > 0,
      },
    })
    if (alert) return alert

    // create new alert
    const newAlertPrice = await this.alertPriceModel.create({
      webhookUrl: data.webhookUrl,
      currency: data.currency,
      currentPrice: +ticker.price,
      price: data.price,
      above: priceDifference > 0,
      active: true,
    })
    return newAlertPrice
  }

  async list(data: ListAlertPricesDto): Promise<AlertPrice[]> {
    return this.alertPriceModel.findAll({
      where: { webhookUrl: data.webhookUrl, active: true },
      order: ['currency', 'price'],
    })
  }

  @Cron('*/5 * * * * *')
  async checkAlertPrices() {
    this.logger.debug(`Checking alert prices...`)

    // get current prices
    const currentPrices = await Promise.all([
      this.tickerService.getTicker({ symbol: 'btcusd' }),
      this.tickerService.getTicker({ symbol: 'btcbrl' }),
    ])

    // check if any alert is triggered
    const triggeredAlerts: AlertPrice[] = []
    for (const currentPrice of currentPrices) {
      const aboveAlerts = await this.alertPriceModel.findAll({
        where: {
          active: true,
          currency: currentPrice.symbol.slice(3),
          above: true,
          price: {
            [Op.lte]: +currentPrice.price,
          },
        },
      })

      const belowAlerts = await this.alertPriceModel.findAll({
        where: {
          active: true,
          currency: currentPrice.symbol.slice(3),
          above: false,
          price: {
            [Op.gte]: +currentPrice.price,
          },
        },
      })

      if (belowAlerts.length > 0) triggeredAlerts.push(...belowAlerts)
      if (aboveAlerts.length > 0) triggeredAlerts.push(...aboveAlerts)
    }

    // post triggered alerts to their webhooks
    if (triggeredAlerts.length > 0) {
      triggeredAlerts.map(async (alert) => {
        await lastValueFrom(
          this.httpService.post(alert.webhookUrl, alert).pipe(
            map(async (response: any) => {
              // deactivate triggered alerts
              if (response.data.data.message === 'OK') {
                await this.deactivateAlertPrice(alert.id)
              }
            }),
            catchError(async () => {
              this.logger.error(`ERROR POST ${alert.webhookUrl}`)
              return null
            }),
          ),
        )
      })
    }
  }

  async deactivateAlertPrice(id: number): Promise<void> {
    await this.alertPriceModel.update(
      {
        active: false,
      },
      {
        where: {
          id,
        },
      },
    )
  }
}
