import { Injectable } from '@nestjs/common';
import { COMMANDS } from 'src/utils';

@Injectable()
export class TntService {
  public async getHelp() {
    const tntCommands = COMMANDS.find((x) => x.cmd == '/tnt');
    return tntCommands;
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