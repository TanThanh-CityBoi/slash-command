import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/middlewares';
import { badRequestRes } from 'src/response-template';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/get-list')
  public async getList(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return badRequestRes({ req, body });
    }
    return this.service.getList(body, req.user.data);
  }
}
