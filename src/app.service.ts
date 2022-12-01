import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sayHello(data: any) {
    console.log(
      '🚀 ~ file: app.service.ts ~ line 6 ~ AppService ~ getListUsers ~ data',
      data,
    );
    return {
      data,
      message: 'Hellooo',
    };
  }
}
