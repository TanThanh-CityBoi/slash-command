import { Body, Controller, Post, Request } from '@nestjs/common';
import { getTeamDomain, response, validateCommand } from 'src/utils';
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
    const teamDomain = getTeamDomain(body);
    if (!isValid) return response(400, message);
    //switch param
    const _getResult = {
      NULL_PARAM: () => this.service.getHelp(),

      //list user
      list: () => this.service.getList(teamDomain),
      l: () => this.service.getList(teamDomain),

      // add user
      add: () => this.service.createAccount(teamDomain, body, req),
      a: () => this.service.createAccount(teamDomain, body, req),

      // remove user
      delete: () => this.service.deleteAccount(teamDomain, body),
      d: () => this.service.deleteAccount(teamDomain, body),

      // update info
      token: () => this.service.updateToken(teamDomain, body, req),
      role: () => this.service.updateRole(teamDomain, body, req),
    };
    return _getResult[command]();
  }
}
