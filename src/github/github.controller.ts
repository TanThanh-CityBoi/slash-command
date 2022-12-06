import { Body, Request, Controller, Post } from '@nestjs/common';
import { COMMANDS, getFirstParam, response } from 'src/utils';
import { isEmpty } from 'lodash';
import { GithubService } from './github.service';

@Controller()
export class GithubController {
  constructor(private readonly service: GithubService) {}

  @Post('')
  public async githubCommand(@Body() body, @Request() req) {
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
      NULL_PARAM: () => {
        return response(400, 'COMMAND_NOT_FOUND');
      },
      '-lb': () => this.service.getListBranch(body),
    };
    return _getResult[firstParam]();
  }
}
