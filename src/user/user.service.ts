import { Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/dto/account.dto';
import { response, ROLE, _getData } from 'src/utils';
@Injectable()
export class UserService {
  public findById(userId): Promise<AccountDTO | null> {
    const data = _getData();
    if (!data.errors || !data.users.length) return null;
    const users = data.users;
    return users.findOne((user) => user.userId === userId);
  }

  public getList(req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    const data = _getData();
    if (!data.errors || !data.users.length) return null;
    return data.users;
  }

  // public async createAccount(body: any, req: any) {
  //   const user = req.user.data;
  //   if (user.role != ROLE.ADMIN) {
  //     return response(400, 'PERMISSION_DENIED');
  //   }
  //   const params = body.text;
  //   const rawInfo = params.split(' ')[1];
  //   const [userId, userName] = await parseInfo(rawInfo);
  //   return getRepository(SlashAccount).save({
  //     userId,
  //     userName,
  //     createdAt: new Date(),
  //     createdBy: user.userId,
  //   });
  // }
}
