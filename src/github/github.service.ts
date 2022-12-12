import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import {
  COMMANDS,
  getTeamDomain,
  getData,
  response,
  getGithubOwner,
} from 'src/utils';
import { isEmpty } from 'lodash';
import { AccountDTO } from 'src/dto';

@Injectable()
export class GithubService {
  public async findUserById(userId: string): Promise<AccountDTO | null> {
    const accounts = await getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async sendRequest(auth: string, option: any, message: string) {
    if (isEmpty(auth)) return [false, 'GITHUB_TOKEN_NULL'];
    const octokit = new Octokit({ auth });
    try {
      const result = await octokit.request(message, option);
      return [true, result];
    } catch (err) {
      return [false, err];
    }
  }

  public async getHelp() {
    const result = COMMANDS._GITHUB.map((val) => {
      return `${val.cmd} ${val.prm.join(' ')} ___Role: ${val.role}`;
    });
    return result;
  }

  public async getBranches(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    const [repo, ghOwner] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const defaultOwner = await getGithubOwner(teamDomain);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    const [isSuccess, result] = await this.sendRequest(
      user.githubToken,
      { owner, repo },
      'GET /repos/{owner}/{repo}/branches',
    );
    if (!isSuccess) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        result?.response?.data || result,
      );
    }
    return result.data.map((val) => val.name);
  }

  public async createRef(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    const [newBranch, baseBranch, repo, ghOwner] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const defaultOwner = await getGithubOwner(teamDomain);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }

    // get base branch
    const [isSuccess, existedBaseBranch] = await this.sendRequest(
      user.githubToken,
      { owner, repo, branch: baseBranch },
      'GET /repos/{owner}/{repo}/branches/{branch}',
    );
    if (!isSuccess) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        existedBaseBranch?.response?.data,
      );
    }

    // create branch
    const sha = existedBaseBranch.data.commit.sha;
    const ref = `refs/heads/${newBranch}`;
    const [isCreated, result] = await this.sendRequest(
      user.githubToken,
      { owner, repo, ref, sha },
      'POST /repos/{owner}/{repo}/git/refs',
    );
    if (!isCreated) {
      return response(
        400,
        'CREATE_FAIL',
        null,
        result?.response?.data || result,
      );
    }
    return {
      Message: 'Created!',
      ref: result.data.ref,
    };
  }

  public async deleteRef(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    const [branch, repo, ghOwner] = text.split(' ').slice(1);
    if (['master', 'main', 'staging', 'aws-prod', 'dev'].includes(branch)) {
      return response(400, 'CANNOT_DELETE_DEFAULT_BRANCH');
    }
    const teamDomain = getTeamDomain(body);
    const defaultOwner = await getGithubOwner(teamDomain);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    const [isDeleted, result] = await this.sendRequest(
      user.githubToken,
      {
        owner,
        repo,
        ref: `heads/${branch}`,
      },
      'DELETE /repos/{owner}/{repo}/git/refs/{ref}',
    );
    if (!isDeleted) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        result?.response?.data || result,
      );
    }
    return response(200, 'DELETED');
  }

  public async createPullRequest(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    const [fromBranch, toBranch, repo, ghOwner] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const defaultOwner = await getGithubOwner(teamDomain);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }

    const [isCreated, result] = await this.sendRequest(
      user.githubToken,
      {
        owner,
        repo,
        title: `Branch: ${fromBranch}`,
        body: 'Please pull these awesome changes in!',
        head: fromBranch,
        base: toBranch,
      },
      'POST /repos/{owner}/{repo}/pulls',
    );
    if (!isCreated) {
      return response(
        400,
        'CREATE_FAIL',
        null,
        result?.response?.data || result,
      );
    }
    return {
      Message: `Pull request created by @${result.data.user.login}`,
      Title: `<${result.data.html_url}|#${result.data.number} ${result.data.title}>`,
    };
  }

  public async mergePullRequest(body: any) {
    const { user_id, text } = body;
    const user = await this.findUserById(user_id);
    const [pullNumber, repo, ghOwner] = text.split(' ').slice(1);
    const teamDomain = getTeamDomain(body);
    const defaultOwner = await getGithubOwner(teamDomain);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }

    const [isSuccess, result] = await this.sendRequest(
      user.githubToken,
      {
        owner,
        repo,
        pull_number: pullNumber,
        commit_title: 'Merge pull request',
        commit_message: `Merge pull ${pullNumber}`,
      },
      'PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge',
    );
    if (!isSuccess) {
      return response(400, 'MERGE_FAIL', null, result?.response.data);
    }
    return result.data.message;
  }
}
