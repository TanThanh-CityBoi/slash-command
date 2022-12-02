import { Injectable } from '@nestjs/common';
import { SlashAccount } from 'src/entities';
import { parseInfo, response, ROLE } from 'src/utils';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {
  getList(req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    return getRepository(SlashAccount).find();
  }

  async createAccount(body: any, req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    const [userId, userName] = await parseInfo(rawInfo);
    return getRepository(SlashAccount).save({
      userId,
      userName,
      createdAt: new Date(),
      createdBy: user.userId,
    });
  }
}
