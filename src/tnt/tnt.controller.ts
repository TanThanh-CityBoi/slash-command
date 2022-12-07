import { Body, Request, Controller, Post } from '@nestjs/common';
import { validateCommand } from 'src/utils';
import { TntService } from './tnt.service';

@Controller('tnt')
export class TntController {
  constructor(private readonly service: TntService) {}

  @Post('')
  public tntCommand(@Body() body, @Request() req) {
    if (req.user.status != 200) {
      return req.user;
    }

    //validate command
    const firstParam = validateCommand(body, req.user.data, 'TNT');
    if (firstParam?.status == 400) return firstParam;

    //switch param
    const _getResult = {
      NULL_PARAM: () => this.service.getHelp(),
      //work space info
      '-w': () => this.service.getWorkspaceInfo(body),
    };
    return _getResult[firstParam]();
  }
}
