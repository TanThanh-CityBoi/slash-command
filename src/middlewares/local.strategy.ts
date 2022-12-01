import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getSlackSignature, hashSignature } from 'src/utils';
import { isEqual } from 'lodash';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'user_id',
      passwordField: 'api_app_id',
    });
  }
  async validate(user_id: string, api_app_id: string): Promise<any> {
    const req: any = RequestContext.currentContext.req;
    const slackSignature = getSlackSignature(req);
    console.log(
      '🚀 ~ file: local.strategy.ts:19 ~ LocalStrategy ~ validate ~ slackSignature',
      slackSignature,
    );
    const payload = req.body;
    if (api_app_id !== process.env.APP_ID) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    const requestTime = req.headers['x-slack-request-timestamp'];
    const secretKey = process.env.SECRET_KEY;
    const hashPayload = await hashSignature(requestTime, payload, secretKey);
    console.log(
      '🚀 ~ file: local.strategy.ts:33 ~ LocalStrategy ~ validate ~ hashPayload',
      hashPayload,
    );
    if (!isEqual(slackSignature, hashPayload)) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    return { user_id, api_app_id };
  }
}
