import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { COMMANDS, getTeamDomain, getData, response } from 'src/utils';
import { isEmpty } from 'lodash';
import { AccountDTO } from 'src/dto';

@Injectable()
export class GithubService {
  public async findUserById(userId: string): Promise<AccountDTO | null> {
    const accounts = await getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async getHelp() {
    return COMMANDS._GITHUB;
  }

  public async getBranches(body: any) {
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

  public async createRef(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const [newBranch, oldBranch, repo] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
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

  public async deleteRef(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const [branch, repo] = text.split(' ').slice(1);
    if (['master', 'main', 'staging', 'aws-prod', 'dev'].includes(branch)) {
      return response(400, 'CANNOT_DELETE_DEFAULT_BRANCH');
    }
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const octokit = new Octokit({
      auth: user.githubToken,
    });

    try {
      const result = await octokit.request(
        'DELETE /repos/{owner}/{repo}/git/refs/{ref}',
        {
          owner,
          repo,
          ref: `heads/${branch}`,
        },
      );
      return response(result.data, 'DELETED');
    } catch (err) {
      return response(400, 'DELETE_FAIL', null, err);
    }
  }

  public async createPullRequest(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const [fromBranch, toBranch, repo] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const octokit = new Octokit({
      auth: user.githubToken,
    });

    try {
      const result = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
        owner,
        repo,
        title: `Branch: ${fromBranch}`,
        body: 'Please pull these awesome changes in!',
        head: fromBranch,
        base: toBranch,
      });
      return result?.data;
    } catch (err) {
      return response(400, 'CREATE_FAIL', null, err);
    }
  }

  public async mergePullRequest(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    if (isEmpty(user.githubToken)) {
      return response(401, 'GITHUB_TOKEN_NULL');
    }
    const [pullNumber, repo] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const owner = process.env[`GH_OWNER_${teamDomain}`];
    const octokit = new Octokit({
      auth: user.githubToken,
    });

    try {
      const result = await octokit.request(
        'PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge',
        {
          owner,
          repo,
          pull_number: pullNumber,
          commit_title: 'Expand enum',
          commit_message: 'Add a new value to the merge_method enum',
        },
      );
      return result;
    } catch (err) {
      return response(400, 'MERGE_FAIL', null, err);
    }
  }
}
