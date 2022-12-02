import { Injectable } from '@nestjs/common';
import { SlashAccount } from 'src/entities';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {
  async getOne(data: any): Promise<SlashAccount> {
    const { user_id } = data;
    return await getRepository(SlashAccount).findOne({ userId: user_id });
  }

  getList(body: any, user: any) {
    return {
      body,
      user,
    };
  }
}
