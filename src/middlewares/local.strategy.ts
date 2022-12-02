import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, RawBodyRequest } from '@nestjs/common';
import { verifySignature } from 'src/utils';
import { UserService } from 'src/user/user.service';
import { isEmpty } from 'lodash';
import { response } from 'src/utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'user_id',
      passwordField: 'api_app_id',
      passReqToCallback: true,
    });
  }
  async validate(req: RawBodyRequest<Request>, user_id: string): Promise<any> {
    const rawBody = req.rawBody;
    if (!verifySignature(req, rawBody)) {
      return response(401, 'UNAUTHORIZED_APP');
    }
    const user = await this.userService.getOne({
      userId: user_id,
      deletedAt: null,
    });
    if (isEmpty(user)) {
      return response(401, 'UNAUTHORIZED_USER');
    }
    return user;
  }
}
