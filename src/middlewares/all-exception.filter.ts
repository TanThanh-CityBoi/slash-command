import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    console.log('==================ERROR:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let reponsePayload = {
      status: 500,
      message: 'INTERNAL_SERVER_ERROR',
      data: null,
      errors: null,
    };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();
      reponsePayload = Object.assign(reponsePayload, {
        status: statusCode,
        message: typeof res === 'string' ? res : res.message,
      });
      response.status(statusCode).json(reponsePayload);
      return;
    }
    if (exception instanceof Error) {
      reponsePayload = Object.assign(reponsePayload, {
        errors: exception.stack,
      });
    }
    response.status(statusCode).json(reponsePayload);
  }
}
