import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getList(body: any) {
    return {
      body,
      message: 'Hellooo',
    };
  }
}
