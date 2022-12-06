import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { isEqual } from 'lodash';

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

const getFirstParam = (body: any, commands: any) => {
  const { command, text } = body;
  const firstParam = text.split(' ')[0] || 'NULL_PARAM';
  // check parammmm????
  return isEqual(command, commands.command) &&
    commands.params.includes(firstParam)
    ? firstParam
    : null;
};

export {
  response,
  verifySignature,
  parseInfo,
  _getData,
  generateRequestId,
  _saveData,
  isCorrectUser,
  getFirstParam,
  getTeamDomain,
};
