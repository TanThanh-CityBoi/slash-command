import { Body, Request, Controller, Post } from '@nestjs/common';
import { slackResponse } from 'src/response-template';
import { getTeamDomain, response, sendSlack, validateCommand } from 'src/utils';
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
    const teamDomain = getTeamDomain(body);
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
      // reset branch
      rb: () => {
        const resetFun = async () => {
          const result = await this.service.resetBranch(body);
          sendSlack(
            teamDomain,
            body.channel_id,
            slackResponse({
              req,
              body,
              response: response(200, 'RESETED!', result),
            }),
          );
        };
        resetFun();
        return 'Please wait!';
      },
    };
    return _getResult[command]();
  }
}
