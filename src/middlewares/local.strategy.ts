import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, RawBodyRequest } from '@nestjs/common';
import { verifySignature } from 'src/utils';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'user_id',
      passwordField: 'api_app_id',
      passReqToCallback: true,
    });
  }
  async validate(
    req: RawBodyRequest<Request>,
    user_id: string,
    api_app_id: string,
  ): Promise<any> {
    const requestContext: any = RequestContext.currentContext.req;
    console.log(
      '🚀 ~ file: local.strategy.ts:22 ~ LocalStrategy ~ classLocalStrategyextendsPassportStrategy ~ requestContext',
      requestContext.rawBody,
    );

    const rawBody = req.rawBody;
    console.log(
      '🚀 ~ file: local.strategy.ts:21 ~ LocalStrategy ~ classLocalStrategyextendsPassportStrategy ~ rawBody',
      rawBody,
    );
    if (api_app_id !== process.env.APP_ID) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    if (!verifySignature(req, rawBody)) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    return { user_id, api_app_id };
  }
}
