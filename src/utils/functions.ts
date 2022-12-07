import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { isEmpty } from 'lodash';
import { COMMANDS, ROLE } from './constant';
import { AccountDTO } from 'src/dto';

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
  let [userId, userName] = rawInfo.split('|');
  userId = userId.replace('<', '').replace('@', '').trim();
  userName = userName.replace('>', '').trim();
  return [userId, userName];
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

const _getData = async (fileName: string): Promise<any> => {
  let objData;
  await fs
    .readFile(join(__dirname, '../../data', fileName), 'utf-8')
    .then((data) => {
      objData = JSON.parse(data.toString());
    })
    .catch((error) => {
      return { errors: error };
    });
  return objData;
};

const _saveData = async (data: any, fileName): Promise<any> => {
  try {
    await fs.writeFile(
      join(__dirname, '../../data', fileName),
      JSON.stringify(data),
    );
    return { message: 'CREATE_OK' };
  } catch (error) {
    return { errors: error };
  }
};

const isCorrectUser = (userInfo: string): boolean => {
  return /<@\w+[|]\w+>/.test(userInfo);
};

const validateCommand = (body: any, userInfo: AccountDTO) => {
  const { command, text } = body;
  const params = text.split(' ');
  const existedCommand = COMMANDS.find(
    (x) =>
      x.cmd == command &&
      x.prm.length == params.length &&
      x.prm[0] == params[0],
  );
  if (isEmpty(existedCommand)) {
    return response(400, 'COMMAND_NOT_FOUND');
  }
  if (userInfo.role !== ROLE.ADMIN && existedCommand.role !== userInfo.role) {
    return response(400, 'PERMISSION_DENIED');
  }
  return params[0] || 'NULL_PARAM';
};

export {
  response,
  verifySignature,
  parseInfo,
  _getData,
  generateRequestId,
  _saveData,
  isCorrectUser,
  validateCommand,
  getTeamDomain,
};
