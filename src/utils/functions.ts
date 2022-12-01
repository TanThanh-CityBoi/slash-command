const crypto = require('crypto');

const payloadParser = (payload) => {
  let result = '';
  for (const key in payload) {
    result += `&${key}=${payload[key]}`;
  }
  result = result.substring(1);
  console.log('🚀 ~ file: functions.ts:21 ~ payloadParser ~ result', result);
  return result;
};

const verifySignature = async function (req, body) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
  const [version, hash] = signature.split('=');
  hmac.update(`${version}:${timestamp}:${body}`);
  return hmac.digest('hex') === hash;
};

const response = (status, message, data = null, error = null) => {
  return {
    status,
    message,
    data,
    error,
  };
};

export { response, payloadParser, verifySignature };
