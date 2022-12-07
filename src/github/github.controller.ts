import { Body, Request, Controller, Post } from '@nestjs/common';
import { validateCommand, response } from 'src/utils';
import { GithubService } from './github.service';

@Controller()
export class GithubController {
  constructor(private readonly service: GithubService) {}

  @Post('')
  public async githubCommand(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    //validate command
    const firstParam = validateCommand(body, req.user.data);
    if (firstParam?.status == 400) return firstParam;

    //switch param
    const _getResult = {
      NULL_PARAM: () => {
        return response(400, 'COMMAND_NOT_FOUND');
      },

      //list branch
      '-lb': () => this.service.getListBranch(body),
    };
    return _getResult[firstParam]();
  }
}
