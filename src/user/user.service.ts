import { Injectable } from '@nestjs/common';
import { SlashAccount } from 'src/entities';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {
  async getOne(condition: any): Promise<SlashAccount> {
    return getRepository(SlashAccount).findOne(condition);
  }

  getList(body: any, user: any) {
    return {
      body,
      user,
    };
  }
}
