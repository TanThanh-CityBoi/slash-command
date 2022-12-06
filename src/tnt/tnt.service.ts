import { Injectable } from '@nestjs/common';

@Injectable()
export class TntService {
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
