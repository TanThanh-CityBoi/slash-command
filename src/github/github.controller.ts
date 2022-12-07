import { Body, Request, Controller, Post } from '@nestjs/common';
import { response, validateCommand } from 'src/utils';
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
    const [isValid, message, command] = validateCommand(
      body,
      req.user.data,
      'GITHUB',
    );
    if (!isValid) return response(400, message);

    //switch param
    const _getResult = {
      NULL_PARAM: () => this.service.getHelp(),
      //list branch
      lb: () => this.service.getBranches(body),
      // create branch
      b: () => this.service.createRef(body),
      // delete branch
      d: () => this.service.deleteRef(body),
      //create pull request
      p: () => this.service.createPullRequest(body),
      //merge pull request
      m: () => this.service.mergePullRequest(body),
    };
    return _getResult[command]();
  }
}
