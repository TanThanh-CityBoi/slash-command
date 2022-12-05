import * as crypto from 'crypto';
import * as fs from 'fs';

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

const response = (status, message, data = null, error = null) => {
  return {
    status,
    message,
    data,
    error,
  };
};

function _getData() {
  let user;
  fs.readFile('../data/account.json', 'utf-8', (err, data) => {
    if (err) {
      return { errors: err };
    }
    user = JSON.parse(data.toString());
  });
  console.log(user);
  return user;
}

export { response, verifySignature, parseInfo, _getData };
