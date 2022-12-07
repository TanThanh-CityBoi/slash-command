import { Body, Controller, Post, Request } from '@nestjs/common';
import { response, validateCommand } from 'src/utils';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('')
  public async userCommand(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    //validate command
    const [isValid, message, command] = validateCommand(
      body,
      req.user.data,
      'USER',
    );
    if (!isValid) return response(400, message);
    //switch param
    const _getResult = {
      NULL_PARAM: () => this.service.getHelp(),

      //list user
      list: () => this.service.getList(),
      l: () => this.service.getList(),

      // add user
      add: () => this.service.createAccount(body, req),
      a: () => this.service.createAccount(body, req),

      // remove user
      delete: () => this.service.deleteAccount(body),
      d: () => this.service.deleteAccount(body),

      // update info
      token: () => this.service.updateInfo(body, req, 'githubToken'),
      role: () => this.service.updateInfo(body, req, 'role'),
    };
    return _getResult[command]();
  }
}
