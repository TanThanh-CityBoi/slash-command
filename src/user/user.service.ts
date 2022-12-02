import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getList(body: any, user: any) {
    return {
      body,
      user,
    };
  }
}
