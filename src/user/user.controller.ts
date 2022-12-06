import { Body, Controller, Post, Request } from '@nestjs/common';
import { COMMANDS, getFirstParam, response } from 'src/utils';
import { isEmpty } from 'lodash';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('')
  public async manageUser(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    //check existed param
    const firstParam = getFirstParam(body, COMMANDS._USER);
    if (isEmpty(firstParam)) {
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
