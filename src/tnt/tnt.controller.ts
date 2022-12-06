import { Body, Request, Controller, Post } from '@nestjs/common';
import { COMMANDS, getFirstParam, response } from 'src/utils';
import { TntService } from './tnt.service';
import { isEmpty } from 'lodash';

@Controller('tnt')
export class TntController {
  constructor(private readonly service: TntService) {}

  @Post('')
  public getWorkspaceInfo(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }

    //check existed param
    const firstParam = getFirstParam(body, COMMANDS._TNT);
    if (isEmpty(firstParam)) {
      return response(400, 'COMMAND_NOT_FOUND');
    }

    //switch param
    const _getResult = {
      //list user
      NULL_PARAM: () => this.service.getWorkspaceInfo(body),
    };
    return _getResult[firstParam]();
  }
}
