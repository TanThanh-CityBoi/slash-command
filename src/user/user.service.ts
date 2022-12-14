import { Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/dto/account.dto';
import {
  COMMANDS,
  isCorrectUser,
  parseInfo,
  response,
  getData,
  saveData,
  ROLE,
  findUserById,
  ROLE_PREORITY,
} from 'src/utils';
import { isEmpty } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class UserService {
  public async getHelp() {
    const result = COMMANDS._USER.map((val) => {
      return `${val.cmd} ${val.prm.join(' ')} ___Role: ${val.role}`;
    });
    return result;
  }

  public async getList(teamDomain: string) {
    const objAccount = getData('account.json') || {};
    const accounts = objAccount[teamDomain] || [];
    if (isEmpty(accounts) || !isEmpty(accounts.errors)) {
      return response(404, 'NOT_FOUND', null, accounts.errors);
    }
    const result = accounts.map((val) => {
      return `<@${val.userId}|${val.userName}>  ${val.role}`;
    });
    return result;
  }

  public async createAccount(teamDomain: string, body: any, req: any) {
    const user = req.user.data;
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    if (!isCorrectUser(rawInfo)) {
      return response(400, 'INVALID_PARAM');
    }
    const [userId, userName] = parseInfo(rawInfo);
    const objAccount = getData('account.json') || {};
    const users = objAccount[teamDomain] || [];
    const existedUser = users.find((x) => x.userId === userId);
    if (!isEmpty(existedUser)) {
      return response(400, 'EXISTED_USER');
    }
    const newUser = new AccountDTO();
    newUser.userId = userId;
    newUser.userName = userName;
    newUser.role = ROLE.USER;
    newUser.githubToken = '';
    newUser.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    newUser.createdBy = user.userId;
    users.push(newUser);
    objAccount[teamDomain] = users;
    const result = await saveData(objAccount, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    return newUser;
  }

  public async deleteAccount(teamDomain: string, body: any) {
    const params = body.text;
    const rawInfo = params.split(' ')[1];
    if (!isCorrectUser(rawInfo)) {
      return response(400, 'INVALID_PARAMS');
    }
    const deleteUserId = parseInfo(rawInfo)[0];
    const reqUserId = body.user_id;
    const deleteUserInfo = findUserById(deleteUserId, teamDomain);
    const reqUserInfo = findUserById(reqUserId, teamDomain);
    if (isEmpty(deleteUserInfo)) {
      return response(404, 'USER_NOT_FOUND');
    }
    const deleteUserPri = ROLE_PREORITY[deleteUserInfo.role.toUpperCase()];
    const reqUserPri = ROLE_PREORITY[reqUserInfo.role.toUpperCase()];
    if (deleteUserPri <= reqUserPri) {
      return response(400, 'PERMISSION_DENIED');
    }
    const objAccount = getData('account.json') || {};
    const users = objAccount[teamDomain] || [];
    const newdata = users.filter((x) => x.userId !== deleteUserId);
    objAccount[teamDomain] = newdata;
    const result = await saveData(objAccount, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    return response(200, 'DELETED');
  }

  private async _updateAccount(teamDomain: string, userId, field, value) {
    const objAccount = getData('account.json') || {};
    const users = objAccount[teamDomain] || [];
    const index = users.findIndex((x) => x.userId == userId);
    if (index < 0) {
      return response(404, 'USER_NOT_FOUND');
    }
    if (!users[index].hasOwnProperty(field)) {
      return response(400, 'UPDATE_FAIL');
    }
    users[index][field] = value;
    objAccount[teamDomain] = users;
    const result = await saveData(objAccount, 'account.json');
    if (isEmpty(result) || !isEmpty(result.errors)) {
      return response(400, 'ERROR', null, result.errors);
    }
    delete users[index].githubToken;
    return response(200, 'UPDATED', users[index]);
  }

  public async updateToken(teamDomain: string, body: any, req: any) {
    const reqUser = req.user.data;
    const params = body.text;
    const valueUpdate = params.split(' ')[1];
    const existedUserParam = params.split(' ')[2];

    if (!existedUserParam) {
      return this._updateAccount(
        teamDomain,
        reqUser.userId,
        'githubToken',
        valueUpdate,
      );
    }
    if (!isCorrectUser(existedUserParam)) {
      return response(400, 'INVALID_PARAMS');
    }

    const updateUserId = parseInfo(existedUserParam)[0];
    const updateUserInfo = findUserById(updateUserId, teamDomain);
    if (isEmpty(updateUserInfo)) {
      return response(404, 'USER_NOT_FOUND');
    }
    const updateUserPri = ROLE_PREORITY[updateUserInfo.role.toUpperCase()];
    const reqUserPri = ROLE_PREORITY[reqUser.role.toUpperCase()];
    if (updateUserPri <= reqUserPri) {
      return response(400, 'PERMISSION_DENIED');
    }

    const userId = parseInfo(existedUserParam)[0];
    return this._updateAccount(teamDomain, userId, 'githubToken', valueUpdate);
  }

  public async updateRole(teamDomain: string, body: any, req: any) {
    const reqUser = req.user.data;
    const params = body.text;
    const valueUpdate = params.split(' ')[1];
    const existedUserParam = params.split(' ')[2];
    if (
      !isCorrectUser(existedUserParam) ||
      !Object.values(ROLE).includes(valueUpdate)
    ) {
      return response(400, 'INVALID_PARAMS');
    }

    const updateUserId = parseInfo(existedUserParam)[0];
    const updateUserInfo = findUserById(updateUserId, teamDomain);
    if (isEmpty(updateUserInfo)) {
      return response(404, 'USER_NOT_FOUND');
    }
    const updateUserPri = ROLE_PREORITY[updateUserInfo.role.toUpperCase()];
    const reqUserPri = ROLE_PREORITY[reqUser.role.toUpperCase()];
    if (updateUserPri <= reqUserPri) {
      return response(400, 'PERMISSION_DENIED');
    }

    const userId = parseInfo(existedUserParam)[0];
    return this._updateAccount(teamDomain, userId, 'role', valueUpdate);
  }
}
