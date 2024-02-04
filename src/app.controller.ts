import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'This is the health check endpoint.',
  })
  @ApiOkResponse({
    description: 'The service is healthy.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OK',
        },
      },
    },
  })
  @Get('/health')
  async health() {
    return { message: 'OK' }
  }
}
