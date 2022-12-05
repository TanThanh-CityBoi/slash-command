import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { join } from 'path';

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

const response = (status, message, data = null, error = null) => {
  return {
    status,
    message,
    data,
    error,
  };
};

const _getData = async () => {
  let user;
  await fs
    .readFile(join(__dirname, '../../data', 'account.json'), 'utf-8')
    .then((data) => {
      user = JSON.parse(data.toString());
    })
    .catch((error) => {
      return { errors: error };
    });
  return user;
};

export { response, verifySignature, parseInfo, _getData, generateRequestId };
