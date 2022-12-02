import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, RawBodyRequest } from '@nestjs/common';
import { verifySignature } from 'src/utils';
import { isEmpty } from 'lodash';
import { response } from 'src/utils';
import { getRepository } from 'typeorm';
import { SlashAccount } from 'src/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'user_id',
      passwordField: 'api_app_id',
      passReqToCallback: true,
    });
  }
  async validate(req: RawBodyRequest<Request>, user_id: string): Promise<any> {
    const { rawBody } = req;
    if (!verifySignature(req, rawBody)) {
      return response(401, 'UNAUTHORIZED_APP');
    }
    const user = await getRepository(SlashAccount).findOne({
      userId: user_id,
      deletedAt: null,
    });
    if (isEmpty(user)) {
      return response(401, 'UNAUTHORIZED_USER');
    }
    return response(200, 'OK', user);
  }
}
