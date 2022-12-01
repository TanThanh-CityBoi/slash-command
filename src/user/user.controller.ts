import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/middlewares';
import { UserService } from './user.service';
import { response } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/get-list')
  public async getList(@Body() body, @Request() req) {
    // const requestTime = '1669879086';
    // const payload = {
    //   token: 'cnIk32ZoZu0gG1ayiKwLyT0x',
    //   team_id: 'T04DJASCU9E',
    //   team_domain: 'thanhcityboi',
    //   channel_id: 'C04DJAWTJBA',
    //   channel_name: 'it',
    //   user_id: 'U04CN1Y68JJ',
    //   user_name: 'tanthanhe',
    //   command: '/user',
    //   text: 'nnnn',
    //   api_app_id: 'A04CE4DLD63',
    //   is_enterprise_install: 'false',
    //   response_url:
    //     'https://hooks.slack.com/commands/T04DJASCU9E/4436153330263/7QFCOTGpPSHc5fyInTHLiuxv',
    //   trigger_id:
    //     '4444097910470.4460366436320.c5c37e40250fa4d33c1621097f0661c2',
    // };

    // const secretKey = process.env.SECRET_KEY;

    // const hashPayload = await hashSignature(requestTime, payload, secretKey);
    // console.log(
    //   '🚀 ~ file: user.controller.ts:14 ~ UserController ~ getList ~ hashPayload',
    //   hashPayload,
    // );

    if (req.user.status != 200) {
      return response(req.user.status, req.user.message);
    }
    return this.service.getList(body);
  }
}
