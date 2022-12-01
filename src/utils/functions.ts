import { sha256 } from 'js-sha256';

const getSlackSignature = (req: any) => {
  return req.headers['x-slack-signature'];
};

const hashSignature = (requestTime, payload, signature) => {
  return 'v0=' + sha256.hmac(signature, `v0:${requestTime}:${payload}`);
};

const response = (status, message, data = null, error = null) => {
  return {
    status,
    message,
    data,
    error,
  };
};

export { getSlackSignature, hashSignature, response };
