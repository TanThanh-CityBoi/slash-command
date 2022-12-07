import { Body, Controller, Post, Request } from '@nestjs/common';
import { validateCommand } from 'src/utils';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('')
  public async manageUser(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    //validate command
    const firstParam = validateCommand(body, req.user.data);
    if (firstParam?.status == 400) return firstParam;

    //switch param
    const _getResult = {
      //list user
      NULL_PARAM: () => this.service.getList(),
      list: () => this.service.getList(),
      '-l': () => this.service.getList(),

      // add user
      add: () => this.service.createAccount(body, req),
      '-a': () => this.service.createAccount(body, req),

      // remove user
      delete: () => this.service.deleteAccount(body),
      '-d': () => this.service.deleteAccount(body),

      // update info
      token: () => this.service.updateInfo(body, req, 'githubToken'),
      role: () => this.service.updateInfo(body, req, 'role'),
    };
    return _getResult[firstParam]();
  }
}
