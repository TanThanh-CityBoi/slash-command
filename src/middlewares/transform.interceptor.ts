import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { slackResponse } from 'src/response-template';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(0);
    const { body } = req;
    return next.handle().pipe(
      map((data) => {
        console.log(
          '🚀 ~ file: transform.interceptor.ts:18 ~ TransformInterceptor ~ map ~ data',
          data,
        );
        const response = {
          status: 200,
          message: 'SUCCESS',
          data: null,
          errors: null,
        };
        if (!data) {
          context.switchToHttp().getResponse().status(500);
          return Object.assign(response, {
            status: 500,
            message: 'INTERNAL_SERVER_ERROR',
          });
        }
        if (data.status && data.message) {
          context.switchToHttp().getResponse().status(data.status);
          const result = Object.assign(response, data);
          return slackResponse({ req, body, response: result });
        }
        context.switchToHttp().getResponse().status(200);
        const result = Object.assign(response, { data });
        return slackResponse({ req, body, response: result });
      }),
    );
  }
}
