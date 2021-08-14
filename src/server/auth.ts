import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import { pwdKey } from '../core';
import { readStorage } from '../storage';

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const pwdHash = (await readStorage())[pwdKey];
  const headers = req.headers;

  if (!headers || !headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = headers.authorization.split(' ')[1];

  if (!(await bcrypt.compare(token, pwdHash))) {
    return res.status(401).send('Unauthorized');
  }

  next();
}
