import { INestApplication } from '@nestjs/common'
import { join } from 'path'
const { readdirSync, lstatSync } = require('fs')
const i18next = require('i18next')
const middleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

export const i18nConfig = async function conf(app: INestApplication): Promise<void> {
  i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      // debug: true,
      backend: {
        loadPath: join(__dirname, '../i18n/{{lng}}.json'),
        addPath: join(__dirname, '../i18n/{{lng}}.missing.json'),
        jsonIndent: 10,
      },
      detection: {
        order: ['querystring', 'header'],
        lookupQuerystring: 'lang',
      },
      lng: 'en_US',
      fallbackLng: 'en_US',
      preload: ['en_US', 'pt_BR'],
      saveMissing: true,
    })

  app.use(middleware.handle(i18next))
}
