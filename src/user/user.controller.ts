import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/middlewares';
import { UserService } from './user.service';
import { response } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/get-list')
  public async getList(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return response(req.user.status, req.user.message);
    }
    return this.service.getList(body, req.user);
  }
}
