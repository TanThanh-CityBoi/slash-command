import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { COMMANDS, getTeamDomain, _getData } from 'src/utils';
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
    const githubCommand = COMMANDS.filter((x) => x.cmd == '/git');
    return githubCommand;
  }

  public async getListBranch(body: any) {
    // const {text } = body;

    const octokit = new Octokit({
      auth: 'YOUR-TOKEN',
    });

    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];

    await octokit.request(
      `GET /repos/${owner}/{repo}/branches{?protected,per_page,page}`,
      {
        owner: 'OWNER',
        repo: 'REPO',
      },
    );
  }
}
