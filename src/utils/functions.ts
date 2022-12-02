import * as crypto from 'crypto';

const verifySignature = (req, body) => {
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

export { response, verifySignature };
