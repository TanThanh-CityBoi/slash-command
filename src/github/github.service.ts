import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { COMMANDS, getTeamDomain, _getData, response } from 'src/utils';
import { isEmpty } from 'lodash';
import { AccountDTO } from 'src/dto';

@Injectable()
export class GithubService {
  public async findUserById(userId: string): Promise<AccountDTO | null> {
    const accounts = await _getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async getHelp() {
    return COMMANDS._GITHUB;
  }

  public async getListBranch(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const repo = text.split(' ')[1];
    const octokit = new Octokit({
      auth: user.githubToken,
    });
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const result = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: owner,
      repo: repo,
    });
    if (result.status != 200) {
      return response(400, 'REQUEST_FAILURE', null, result);
    }
    return result?.data;
  }
}
