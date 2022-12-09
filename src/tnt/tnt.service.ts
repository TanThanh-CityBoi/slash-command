import { Injectable } from '@nestjs/common';
import { COMMANDS } from 'src/utils';

@Injectable()
export class TntService {
  public async getHelp() {
    const result = COMMANDS._TNT.map((val) => {
      return `${val.cmd} ${val.prm.join(' ')} ___Role: ${val.role}`;
    });
    return result;
  }

  public getWorkspaceInfo(body: any) {
    const {
      team_id,
      team_domain,
      channel_id,
      channel_name,
      user_id,
      user_name,
    } = body;
    return {
      team_id,
      team_domain,
      channel_id,
      channel_name,
      user_id,
      user_name,
    };
  }
}
