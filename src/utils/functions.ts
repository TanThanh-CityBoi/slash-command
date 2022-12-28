import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as fsCre from 'fs';
import { join } from 'path';
import { isEmpty } from 'lodash';
import { COMMANDS, ROLE, ROLE_PREORITY } from './constant';
import { AccountDTO } from 'src/dto';
import * as moment from 'moment';
import axios from 'axios';

const getGithubOwner = async (teamDomain: string) => {
  const data = getData('github.json') || {};
  return data[teamDomain.trim().toUpperCase()] || [];
};

const verifySignature = (req, rawBody, teamDomain) => {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const secret = process.env[`SECRET_KEY_${teamDomain.trim().toUpperCase()}`];
  const hmac = crypto.createHmac('sha256', secret);
  const [version, hash] = signature.split('=');
  hmac.update(`${version}:${timestamp}:${rawBody}`);
  return hmac.digest('hex') === hash;
};

const parseInfo = (rawInfo: string) => {
  return rawInfo.replace(/<|@|>/g, '').split('|');
};

const getTeamDomain = (body: any): string => {
  const { team_domain } = body;
  return team_domain.trim().toUpperCase();
};

const generateRequestId = () => {
  const time = Date.now().toString();
  const randomNumbers = Math.floor(Math.random() * (1000 - 100) + 100);
  return time + randomNumbers.toString();
};

const response = (status, message, data = null, errors = null) => {
  return {
    status,
    message,
    data,
    errors,
  };
};

const getData = (fileName: string) => {
  const path = join(process.cwd(), '/data', fileName);
  const isExisted = fsCre.existsSync(path);
  if (!isExisted) return null;
  const data = fsCre.readFileSync(path, 'utf-8') || '{}';
  return JSON.parse(data);
};

const saveData = async (data: any, fileName): Promise<any> => {
  try {
    await fs.writeFile(
      join(process.cwd(), '/data', fileName),
      JSON.stringify(data),
    );
    return data;
  } catch (error) {
    console.log(error);
    return { errors: error };
  }
};

const isCorrectUser = (userInfo: string): boolean => {
  return /<@\w+[|].*>/.test(userInfo);
};

const validateCommand = (body: any, userInfo: AccountDTO, type: string) => {
  const { command, text } = body;
  const params = text.split(/\s+/g);
  const existedCommand = COMMANDS[`_${type}`].find(
    (x) =>
      x.cmd == command &&
      x.prm.length == params.length &&
      x.prm[0] == params[0],
  );
  if (isEmpty(existedCommand)) {
    return [false, 'COMMAND_NOT_FOUND'];
  }
  const userPriority = ROLE_PREORITY[userInfo.role.toUpperCase()];
  const reqUserPriority = ROLE_PREORITY[existedCommand.role.toUpperCase()];
  if (userPriority > reqUserPriority) {
    return [false, 'PERMISSION_DENIED'];
  }
  return [true, 'SUCCESSFULLY', params[0] || 'NULL_PARAM'];
};

const generateData = async () => {
  const fileData = getData('account.json') || {};
  const listWorkSpace = Object.keys(process.env)
    .filter((itm) => itm.includes('SECRET_KEY_'))
    .map((key) => key.split('SECRET_KEY_')[1]);
  listWorkSpace.map((workspace) => {
    if (!isEmpty(fileData) && !isEmpty(fileData[workspace])) {
      return;
    }
    const rootUser = new AccountDTO();
    rootUser.userId = process.env[`ROOT_USER_ID_${workspace}`];
    rootUser.userName = process.env[`ROOT_USER_NAME_${workspace}`];
    rootUser.githubToken = '';
    rootUser.role = ROLE.ROOT;
    rootUser.createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    rootUser.createdBy = '';
    fileData[workspace] = [rootUser];
  });
  await saveData(fileData, 'account.json');
};

const findUserById = (userId: string, teamDomain) => {
  const objAccount = getData('account.json');
  const accounts = objAccount[teamDomain] || [];
  if (isEmpty(accounts) || !isEmpty(accounts.errors)) return null;
  return accounts.find((account) => account.userId === userId);
};

const sendSlack = (teamDomain, channel, content) => {
  const slackToken = process.env[`BOT_TOKEN_${teamDomain}`];
  send().catch((err) => console.log(err));

  async function send() {
    const url = 'https://slack.com/api/chat.postMessage';
    await axios.post(
      url,
      {
        channel: channel,
        blocks: content.blocks,
      },
      { headers: { authorization: `Bearer ${slackToken}` } },
    );
  }
};

export {
  response,
  verifySignature,
  parseInfo,
  getData,
  generateRequestId,
  saveData,
  isCorrectUser,
  validateCommand,
  getTeamDomain,
  generateData,
  getGithubOwner,
  findUserById,
  sendSlack,
};
