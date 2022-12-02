import { Body, Controller, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/get-list')
  public async getList(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    return this.service.getList(body, req.user.data);
  }
}
