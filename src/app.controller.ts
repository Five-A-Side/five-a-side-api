import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    console.log("Deployed using the staging database uri:" + process.env.MONGO_URI + process.env.NODE_ENV);
    return this.appService.getHello();
  }
}
