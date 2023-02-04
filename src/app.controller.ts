import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    this.logger.log('Example log');

    return this.appService.getHello();
  }
}
