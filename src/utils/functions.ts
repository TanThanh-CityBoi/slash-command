import { sha256 } from 'js-sha256';

const getSlackSignature = (req: any) => {
  return req.headers['x-slack-signature'];
};

const hashSignature = (requestTime, payload, signature) => {
  return (
    'v0=' +
    sha256.hmac(signature, `v0:${requestTime}:${payloadParser(payload)}`)
  );
};

const payloadParser = (payload) => {
  let result = '';
  for (const key in payload) {
    result += `&${key}=${payload[key]}`;
  }
  result = result.substring(1);
  console.log('🚀 ~ file: functions.ts:21 ~ payloadParser ~ result', result);
  return result;
};

const response = (status, message, data = null, error = null) => {
  return {
    status,
    message,
    data,
    error,
  };
};

export { getSlackSignature, hashSignature, response, payloadParser };
