import {
  ExecutionContext,
  CallHandler,
  ContextType,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  DelegatorService,
  InjectOgmaInterceptorOptions,
  OgmaInterceptorOptions,
  OgmaService,
} from '@ogma/nestjs-module';
import { InterceptorMeta } from '@ogma/nestjs-module/lib/interceptor/interfaces/interceptor-service.interface';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OgmaOptions } from '@ogma/logger';
import { RequestContext } from 'nestjs-request-context';
import { generateRequestId } from 'src/utils';

@Injectable()
export class TntInterceptor implements NestInterceptor {
  private json: boolean;
  private color: boolean;

  constructor(
    @InjectOgmaInterceptorOptions()
    private readonly options: OgmaInterceptorOptions,
    private readonly service: OgmaService,
    private readonly delegate: DelegatorService,
    private readonly reflector: Reflector,
  ) {
    const ogmaOptions: OgmaOptions = (this.service as any).ogma.options;
    this.json = ogmaOptions.json;
    this.color = ogmaOptions.color;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const startTime = Date.now();
    const options = { ...this.options, json: this.json, color: this.color };
    const reqContext: any = RequestContext.currentContext.req;
    const requestId = reqContext['requestId'] || generateRequestId();
    this.delegate.setRequestId(context, requestId);
    return next.handle().pipe(
      this.rxJsLogTap({
        context,
        startTime,
        options,
        correlationId: requestId,
      }),
    );
  }

  public shouldLogAndDoIt(
    method: 'Error' | 'Success',
    {
      context,
      startTime,
      data,
      correlationId,
      options,
    }: InterceptorMeta & { data: any },
  ): void {
    const callMethod = `getContext${method}String`;
    if (this.shouldSkip(context)) return;
    const logObject = this.delegate[callMethod](
      data,
      context,
      startTime,
      options,
    );
    this.log(logObject, correlationId);
  }

  public shouldSkip(context: ExecutionContext): boolean {
    const decoratorSkip =
      this.reflector.get('OGMA_INTERCEPTOR_SKIP', context.getClass()) ||
      this.reflector.get('OGMA_INTERCEPTOR_SKIP', context.getHandler());
    if (decoratorSkip) {
      return true;
    }
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http':
        return !this.options.http;
      case 'graphql':
        return (
          !this.options.gql ||
          context.getArgByIndex(3)?.operation?.operation === 'subscription'
        );
      case 'ws':
        return !this.options.ws;
      case 'rpc':
        return !this.options.rpc;
    }
  }

  public rxJsLogTap(meta: InterceptorMeta): MonoTypeOperatorFunction<void> {
    return tap({
      next: (data) => {
        const info = { ...meta, data };
        this.shouldLogAndDoIt('Success', info);
      },
      error: (err) => {
        const info = { ...meta, data: err };
        this.shouldLogAndDoIt('Error', info);
      },
    });
  }

  public log(logObject: any, correlationId?: string): void {
    const reqContext: any = RequestContext.currentContext.req;
    const reqUserId = reqContext['accountId'] || 0;
    const context = `${reqUserId}`;
    this.service.info(logObject, {
      context,
      correlationId,
    });
  }
}
