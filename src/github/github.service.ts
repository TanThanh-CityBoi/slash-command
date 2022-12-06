import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { _getData } from 'src/utils';
import { isEmpty } from 'lodash';
import { AccountDTO } from 'src/dto';

@Injectable()
export class GithubService {
  public async findUserById(userId: string): Promise<AccountDTO | null> {
    const accounts = await _getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async getListBranch(data: any) {
    console.log(
      '🚀 ~ file: github.service.ts:16 ~ GithubService ~ getListBranch ~ data',
      data,
    );
    const octokit = new Octokit({
      auth: 'YOUR-TOKEN',
    });

    await octokit.request(
      'GET /repos/{owner}/{repo}/branches{?protected,per_page,page}',
      {
        owner: 'OWNER',
        repo: 'REPO',
      },
    );
  }
}
