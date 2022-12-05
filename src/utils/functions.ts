import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { join } from 'path';
import { AccountDTO } from 'src/dto';
// import { AccountDTO } from 'src/dto';

const verifySignature = (req, body) => {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
  const [version, hash] = signature.split('=');
  hmac.update(`${version}:${timestamp}:${body}`);
  return hmac.digest('hex') === hash;
};

const parseInfo = (rawInfo: string) => {
  let [userId, userName] = rawInfo.split('|');
  userId = userId.replace('<', '').replace('@', '').trim();
  userName = userName.replace('>', '').trim();
  return [userId, userName];
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

const _saveData = async (account: AccountDTO, fileName): Promise<any> => {
  let objData;
  await fs
    .readFile(join(__dirname, '../../data', fileName), 'utf-8')
    .then((data) => {
      objData = JSON.parse(data.toString());
    })
    .catch((error) => {
      return { errors: error };
    });
  objData.push(account);
  try {
    await fs.writeFile(
      join(__dirname, '../../data', fileName),
      JSON.stringify(objData),
    );
    return account;
  } catch (error) {
    return { errors: error };
  }
};

export {
  response,
  verifySignature,
  parseInfo,
  _getData,
  generateRequestId,
  _saveData,
};
