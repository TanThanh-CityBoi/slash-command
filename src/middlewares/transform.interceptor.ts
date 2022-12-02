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
        const response = {
          status: 200,
          message: 'SUCCESS',
          data: null,
          errors: null,
        };
        if (!data) {
          const result = Object.assign(response, {
            status: 500,
            message: 'INTERNAL_SERVER_ERROR',
          });
          return slackResponse({ req, body, response: result.toString() });
        }
        if (data.status && data.message) {
          const result = Object.assign(response, data);
          return slackResponse({ req, body, response: result.toString() });
        }
        const result = Object.assign(response, { data });
        return slackResponse({ req, body, response: result.toString() });
      }),
    );
  }
}
