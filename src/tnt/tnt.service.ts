import { Injectable } from '@nestjs/common';
import {
  COMMANDS,
  getData,
  getTeamDomain,
  saveData,
  response,
} from 'src/utils';

@Injectable()
export class TntService {
  public async getHelp() {
    const result = COMMANDS._TNT.map((val) => {
      return `${val.cmd} ${val.prm.join(' ')} ___Role: ${val.role}`;
    });
    return result;
  }

  public async getWorkspaceInfo(body: any) {
    const {
      team_id,
      team_domain,
      channel_id,
      channel_name,
      user_id,
      user_name,
    } = body;
    const data = await getData('github.json');
    const github_owners = data.join(' __ ');
    return {
      team_id,
      team_domain,
      channel_id,
      channel_name,
      user_id,
      user_name,
      github_owners,
    };
  }

  public async addGitHubOwner(body: any) {
    const { text } = body;
    const newGithubOwner = text.split(' ')[1];
    const data = (await getData('github.json')) || {};
    const teamDomain = getTeamDomain(body);
    const githubOwners = data[teamDomain] || [];
    if (data[teamDomain] && data[teamDomain].includes(newGithubOwner)) {
      return response(400, 'EXISTED');
    }
    githubOwners.push(newGithubOwner);
    data[teamDomain] = githubOwners;
    await saveData(data, 'github.json');
    return data[teamDomain];
  }
}
