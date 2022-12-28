import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, RawBodyRequest } from '@nestjs/common';
import { findUserById, verifySignature } from 'src/utils';
import { isEmpty } from 'lodash';
import { response } from 'src/utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'user_id',
      passwordField: 'team_domain',
      passReqToCallback: true,
    });
  }
  async validate(
    req: RawBodyRequest<Request>,
    user_id: string,
    team_domain: string,
  ): Promise<any> {
    const { rawBody } = req;
    if (!verifySignature(req, rawBody, team_domain)) {
      return response(401, 'UNAUTHORIZED_APP');
    }
    const user = await findUserById(user_id, team_domain.toUpperCase());
    if (isEmpty(user)) {
      return response(401, 'UNAUTHORIZED_USER');
    }
    return response(200, 'OK', user);
  }
}
