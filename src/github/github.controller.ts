import { Body, Request, Controller, Post } from '@nestjs/common';
import { validateCommand } from 'src/utils';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly service: GithubService) {}

  @Post('')
  public async githubCommand(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }
    //validate command
    const firstParam = validateCommand(body, req.user.data, 'GITHUB');
    if (firstParam?.status == 400) return firstParam;

    //switch param
    const _getResult = {
      NULL_PARAM: () => this.service.getHelp(),
      //list branch
      '-lb': () => this.service.getListBranch(body),
      '-b': () => this.service.createBranch(body),
    };
    return _getResult[firstParam]();
  }
}
