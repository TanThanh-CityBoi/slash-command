import { Body, Controller, Post, Request } from '@nestjs/common';
import { COMMANDS, response, USR_COMMAND } from 'src/utils';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('')
  public async getList(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    const { command, text } = body;
    const firstParam = text.split(' ')[0] || 'NULL_PARAM';
    if (
      !COMMANDS.includes(command) ||
      !Object.values(USR_COMMAND).includes(firstParam)
    ) {
      return response(400, 'COMMAND_NOT_FOUND');
    }
    const _getResult = {
      NULL_PARAM: () => this.service.getList(body, req),
      list: () => this.service.getList(body, req),
      '-l': () => this.service.getList(body, req),
    };
    return _getResult[firstParam]();
  }
}
