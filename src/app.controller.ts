import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('users')
  getListUsers(@Body() body) {
    return this.appService.getListUsers(body);
  }
}
