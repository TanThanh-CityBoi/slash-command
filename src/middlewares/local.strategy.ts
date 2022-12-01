import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { verifySignature } from 'src/utils';

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
    req: Request,
    user_id: string,
    api_app_id: string,
  ): Promise<any> {
    if (api_app_id !== process.env.APP_ID) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    if (!verifySignature(req, req.body)) {
      return {
        status: 400,
        message: 'UNAUTHORIZE_SERVER',
      };
    }
    return { user_id, api_app_id };
  }
}
