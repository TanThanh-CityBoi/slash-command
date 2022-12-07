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
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const octokit = new Octokit({
      auth: user.githubToken,
    });
    try {
      const result = await octokit.request(
        'GET /repos/{owner}/{repo}/branches',
        {
          owner: owner,
          repo: repo,
        },
      );
      return result?.data;
    } catch (err) {
      return response(400, 'REQUEST_FAIL', null, err);
    }
  }

  public async createBranch(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const params = text.split(' ');
    const repo = params[3];
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const newBranch = params[1];
    const oldBranch = params[2];
    const octokit = new Octokit({
      auth: user.githubToken,
    });
    // get old branch
    let existedOldBranch;
    try {
      existedOldBranch = await octokit.request(
        'GET /repos/{owner}/{repo}/branches/{branch}',
        {
          owner,
          repo,
          branch: oldBranch,
        },
      );
    } catch (err) {
      return response(400, 'REQUEST_FAIL', null, err);
    }
    const sha = existedOldBranch.data.commit.sha;
    // create branch
    try {
      const result = await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha,
      });
      return result?.data;
    } catch (err) {
      return response(400, 'CREATE_FAIL', null, err);
    }
  }
}
