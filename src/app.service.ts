import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getListUsers(data: any) {
    return {
      data,
      message: 'Hellooo',
    };
  }
}
