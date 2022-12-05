import { Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/dto/account.dto';
import { parseInfo, response, ROLE, _getData, _saveData } from 'src/utils';
@Injectable()
export class UserService {
  public async findById(userId: string): Promise<AccountDTO | null> {
    const accounts = await _getData('account.json');
    if (!accounts || accounts.errors || !accounts.length) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async getList(req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    const accounts = await _getData('account.json');
    if (!accounts || accounts.errors || !accounts.length) {
      return response(404, 'NOT_FOUND', null, accounts.errors);
    }
    return accounts;
  }

  public async createAccount(body: any, req: any) {
    const user = req.user.data;
    if (user.role != ROLE.ADMIN) {
      return response(400, 'PERMISSION_DENIED');
    }
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    const [userId, userName] = await parseInfo(rawInfo);
    const newUser = new AccountDTO();
    newUser.userId = userId;
    newUser.userName = userName;
    newUser.role = 'USER';
    newUser.createdAt = new Date();
    newUser.createdBy = user.userId;

    const result = await _saveData(newUser, 'account.json');
    if (!result || result.errors) {
      return response(400, 'ERROR', null, result.errors);
    }
    return result;
  }
}
