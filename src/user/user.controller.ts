import { Body, Controller, Post, Request } from '@nestjs/common';
import { COMMANDS, response } from 'src/utils';
import { isDeepStrictEqual } from 'util';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('')
  public async getList(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }

    //check existed command + param
    const USER_CMD = COMMANDS._USER;
    const { command, text } = body;
    const firstParam = text.split(' ')[0] || 'NULL_PARAM';
    if (
      !isDeepStrictEqual(command, USER_CMD.command) ||
      !USER_CMD.params.includes(firstParam)
    ) {
      return response(400, 'COMMAND_NOT_FOUND');
    }

    //switch param
    const _getResult = {
      //list user
      NULL_PARAM: () => this.service.getList(req),
      list: () => this.service.getList(req),
      '-l': () => this.service.getList(req),

      // add user
      add: () => this.service.createAccount(body, req),
      '-a': () => this.service.createAccount(body, req),

      // remove user
      delete: () => this.service.deleteAccount(body, req),
      '-d': () => this.service.deleteAccount(body, req),

      // update info
      token: () => this.service.updateInfo(body, req, 'githubToken'),
      role: () => this.service.updateInfo(body, req, 'role'),
    };
    return _getResult[firstParam]();
  }
}
