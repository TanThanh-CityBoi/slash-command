const crypto = require('crypto');

const payloadParser = (payload) => {
  let result = '';
  for (const key in payload) {
    result += `&${key}=${payload[key]}`;
  }
  result = result.substring(1);
  return result;
};

const verifySignature = async function (req, body) {
  console.log(
    '🚀 ~ file: functions.ts:13 ~ verifySignature ~ req',
    req.headers,
  );
  const signature = req.headers['x-slack-signature'];
  console.log(
    '🚀 ~ file: functions.ts:14 ~ verifySignature ~ signature',
    signature,
  );
  const timestamp = req.headers['x-slack-request-timestamp'];
  console.log(
    '🚀 ~ file: functions.ts:23 ~ verifySignature ~ timestamp',
    timestamp,
  );
  const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
  const [version, hash] = signature.split('=');
  console.log('🚀 ~ file: functions.ts:29 ~ verifySignature ~ hash', hash);
  hmac.update(`${version}:${timestamp}:${body}`);
  console.log(
    "🚀 ~ file: functions.ts:19 ~ verifySignature ~ hmac.digest('hex') === hash",
    hmac.digest('hex') === hash,
  );
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
