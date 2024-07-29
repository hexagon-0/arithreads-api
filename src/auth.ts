import * as jwt from 'jsonwebtoken';

function getSecret () {
  const secret = process.env.JWT_SECRET;
  if (secret === undefined) {
    throw new Error('JWT secret is undefined');
  }

  return secret;
}

export function sign (data: any) {
  const secret = getSecret();
  
  return jwt.sign(data, secret, { algorithm: 'HS256', expiresIn: '24h' });
}

export function verify (token: string) {
  const secret = getSecret();

  return jwt.verify(token, secret, { algorithms: ['HS256'] });
}
