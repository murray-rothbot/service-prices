import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TickerModule } from './../src/domain/ticker/ticker.module'

describe('TickerController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TickerModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  for (let test_symbol of ['BTCUSD', 'btcusd', 'BTCBRL', 'btcbrl']) {
    it(`ticker?symbol=${test_symbol} (GET)`, () => {
      return request(app.getHttpServer())
        .get(`/ticker?symbol=${test_symbol}`)
        .expect(200)
        .expect((res) => {
          const { price, symbol, source } = res.body
          if (!price || !symbol || !source) {
            console.error(`Body content: ${JSON.stringify(res.body)}`)
            throw Error()
          }
        })
    })
  }

  it('ticker?symbol=XXXYYY (GET)', () => {
    return request(app.getHttpServer()).get('/ticker?symbol=INVALID').expect(500)
  }, 30000)
})
