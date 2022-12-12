import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import {
  COMMANDS,
  getTeamDomain,
  getData,
  response,
  getGithubOwner,
  GH_API,
} from 'src/utils';
import { isEmpty } from 'lodash';
import { AccountDTO } from 'src/dto';

@Injectable()
export class GithubService {
  public async findUserById(
    userId: string,
    teamDomain,
  ): Promise<AccountDTO | null> {
    const objAccount = await getData('account.json');
    const accounts = objAccount[teamDomain] || [];
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async sendRequest({ auth, apiUrl, options }) {
    if (isEmpty(auth)) return [false, 'GITHUB_TOKEN_NULL'];
    const octokit = new Octokit({ auth });
    try {
      const result = await octokit.request(apiUrl, options);
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
    const teamDomain = getTeamDomain(body);
    const [user, defaultOwner] = await Promise.all([
      this.findUserById(user_id, teamDomain),
      getGithubOwner(teamDomain),
    ]);
    const [repo, ghOwner] = text.split(' ').slice(1);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    const [isSuccess, result] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo },
      apiUrl: GH_API.GET_LIST_BRANCHES,
    });
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
    const teamDomain = getTeamDomain(body);
    const [user, defaultOwner] = await Promise.all([
      this.findUserById(user_id, teamDomain),
      getGithubOwner(teamDomain),
    ]);
    const [repo, newBranch, baseBranch = 'staging', ghOwner] = text
      .split(' ')
      .slice(1);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    // get base branch
    const [isSuccess, existedBaseBranch] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, branch: baseBranch },
      apiUrl: GH_API.GET_BRANCH,
    });
    if (!isSuccess) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        existedBaseBranch?.response?.data || existedBaseBranch,
      );
    }
    // create branch
    const sha = existedBaseBranch.data.commit.sha;
    const ref = `refs/heads/${newBranch}`;
    const [isCreated, result] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, ref, sha },
      apiUrl: GH_API.CREATE_BRANCH,
    });
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
    const teamDomain = getTeamDomain(body);
    const [user, defaultOwner] = await Promise.all([
      this.findUserById(user_id, teamDomain),
      getGithubOwner(teamDomain),
    ]);
    const [repo, branch, ghOwner] = text.split(' ').slice(1);
    if (['master', 'main', 'staging', 'aws-prod', 'dev'].includes(branch)) {
      return response(400, 'CANNOT_DELETE_DEFAULT_BRANCH');
    }
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    const [isDeleted, result] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, ref: `heads/${branch}` },
      apiUrl: GH_API.DELETE_BRANCH,
    });
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
    const teamDomain = getTeamDomain(body);
    const [user, defaultOwner] = await Promise.all([
      this.findUserById(user_id, teamDomain),
      getGithubOwner(teamDomain),
    ]);
    const [repo, fromBranch, toBranch = 'staging', ghOwner] = text
      .split(' ')
      .slice(1);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }
    const [isCreated, result] = await this.sendRequest({
      auth: user.githubToken,
      options: {
        owner,
        repo,
        title: `Branch: ${fromBranch}`,
        body: 'Please pull these awesome changes in!',
        head: fromBranch,
        base: toBranch,
      },
      apiUrl: GH_API.CREATE_PULL_REQUEST,
    });
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
    const teamDomain = getTeamDomain(body);
    const [defaultOwner, user] = await Promise.all([
      getGithubOwner(teamDomain),
      this.findUserById(user_id, teamDomain),
    ]);
    const [pullNumber, repo, ghOwner] = text.split(' ').slice(1);
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }

    const [isSuccess, result] = await this.sendRequest({
      auth: user.githubToken,
      options: {
        owner,
        repo,
        pull_number: pullNumber,
        commit_title: 'Merge pull request',
        commit_message: `Merge pull ${pullNumber}`,
      },
      apiUrl: GH_API.MERGE_PULL_REQUEST,
    });
    if (!isSuccess) {
      return response(400, 'MERGE_FAIL', null, result?.response.data);
    }
    return result.data.message;
  }

  public async resetBranch(body: any) {
    const { user_id, text } = body;
    const teamDomain = getTeamDomain(body);
    const [user, defaultOwner] = await Promise.all([
      this.findUserById(user_id, teamDomain),
      getGithubOwner(teamDomain),
    ]);
    const [repo, branch, baseBranch = 'staging', ghOwner] = text
      .split(' ')
      .slice(1);
    if (['master', 'main', 'staging', 'aws-prod'].includes(branch)) {
      return response(400, 'CANNOT_RESET_DEFAULT_BRANCH');
    }
    const owner = ghOwner ? ghOwner : defaultOwner[0];
    if (isEmpty(owner)) {
      return response(400, 'GH_OWNER_NOT_FOUND');
    }

    // get base branch
    const [isSuccess, existedBaseBranch] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, branch: baseBranch },
      apiUrl: GH_API.GET_BRANCH,
    });
    if (!isSuccess) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        existedBaseBranch?.response?.data || existedBaseBranch,
      );
    }

    // delete branch
    const [isDeleted, deleteResult] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, ref: `heads/${branch}` },
      apiUrl: GH_API.DELETE_BRANCH,
    });
    if (!isDeleted) {
      return response(
        400,
        'REQUEST_FAIL',
        null,
        deleteResult?.response?.data || deleteResult,
      );
    }

    // create branch
    const sha = existedBaseBranch.data.commit.sha;
    const ref = `refs/heads/${branch}`;
    const [isCreated, result] = await this.sendRequest({
      auth: user.githubToken,
      options: { owner, repo, ref, sha },
      apiUrl: GH_API.CREATE_BRANCH,
    });
    if (!isCreated) {
      return response(
        400,
        'CREATE_FAIL',
        null,
        result?.response?.data || result,
      );
    }
    return {
      Message: 'Reseted!',
      ref: result.data.ref,
    };
  }
}
