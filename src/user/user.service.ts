import { Injectable } from '@nestjs/common';
import { SlashAccount } from 'src/entities';
import { response, ROLE } from 'src/utils';
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
}
