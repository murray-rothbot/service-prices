import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

@Injectable()
export class AppService {
  constructor(@Inject(REQUEST) private req) {}

  getHello(): string {
    return this.req.t('hello-world')
  }
}
