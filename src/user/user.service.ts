import { Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/dto/account.dto';
import {
  COMMANDS,
  isCorrectUser,
  parseInfo,
  response,
  getData,
  saveData,
} from 'src/utils';
import { isEmpty } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class UserService {
  public async findById(userId: string): Promise<AccountDTO | null> {
    const accounts = await getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
    return accounts.find((account) => account.userId === userId);
  }

  public async getHelp() {
    const result = COMMANDS._USER.map((val) => {
      return `${val.cmd} ${val.prm.join(' ')} ___Role: ${val.role}`;
    });
    return result;
  }

  public async getList() {
    const accounts = await getData('account.json');
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) {
      return response(404, 'NOT_FOUND', null, accounts.errors);
    }
    const result = accounts.map((val) => {
      return `<@${val.userId}|${val.userName}>  ${val.role}`;
    });
    return result;
  }

  public async createAccount(body: any, req: any) {
    const user = req.user.data;
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    if (!isCorrectUser(rawInfo)) {
      return response(400, 'COMMAND_NOT_FOUND');
    }
    const [userId, userName] = await parseInfo(rawInfo);
    const users = await getData('account.json');
    const existedUser = users.find((x) => x.userId === userId);
    if (!isEmpty(existedUser)) {
      return response(400, 'EXISTED_USER');
    }
    const newUser = new AccountDTO();
    newUser.userId = userId;
    newUser.userName = userName;
    newUser.role = 'USER';
    newUser.githubToken = '';
    newUser.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    newUser.createdBy = user.userId;

    users.push(newUser);
    const result = await saveData(users, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    return newUser;
  }

  public async deleteAccount(body: any) {
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    if (!isCorrectUser(rawInfo)) {
      return response(400, 'INVALID_PARAMS');
    }
    const userId = await parseInfo(rawInfo)[0];
    const existedUser = await this.findById(userId);
    if (isEmpty(existedUser)) {
      return response(404, 'USER_NOT_FOUND');
    }
    const users = await getData('account.json');
    const newdata = users.filter((x) => x.userId !== userId);
    const result = await saveData(newdata, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    return response(200, 'DELETED');
  }

  private async _updateAccount(userId, field, value) {
    const users = await getData('account.json');
    const index = users.findIndex((x) => x.userId == userId);
    if (index < 0) {
      return response(404, 'USER_NOT_FOUND');
    }
    if (!users[index].hasOwnProperty(field)) {
      return response(400, 'UPDATE_FAIL');
    }
    users[index][field] = value;
    const result = await saveData(users, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    delete users[index].githubToken;
    return response(200, 'UPDATED', users[index]);
  }

  public async updateInfo(body: any, req: any, field: string) {
    const reqUser = req.user.data;
    const params = body.text;
    const valueUpdate = params.split(' ')[1];
    const existedUserParam = params.split(' ')[2];
    if (existedUserParam) {
      if (!isCorrectUser(existedUserParam)) {
        return response(400, 'INVALID_PARAMS');
      }
      const userId = await parseInfo(existedUserParam)[0];
      return this._updateAccount(userId, field, valueUpdate);
    }
    return this._updateAccount(reqUser.userId, field, valueUpdate);
  }
}
