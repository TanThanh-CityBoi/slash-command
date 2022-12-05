import { Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/dto/account.dto';
import { response, ROLE, _getData } from 'src/utils';
@Injectable()
export class UserService {
  public async findById(userId: string): Promise<AccountDTO | null> {
    const data = await _getData();
    if (!data || data.errors || !data.accounts.length) return null;
    const accounts = data.accounts;
    return accounts.find((account) => account.userId === userId);
  }

  public async getList(req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    const data = await _getData();
    if (!data || data.errors || !data.accounts.length) {
      return response(404, 'NOT_FOUND');
    }
    return data.accounts;
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
