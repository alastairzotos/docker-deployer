import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Docker } from 'node-docker-api';
import * as WebSocket from 'ws';
import { pwdKey, secretKey } from '../core';
import { readStorage } from '../storage';
import { handleBroadcastStatus } from './broadcastStatus';

export const verifyPassword = async (password: string) => {
  const pwdHash = (await readStorage())[pwdKey];

  return await bcrypt.compare(password, pwdHash);
}

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const headers = req.headers;

  if (!headers || !headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = headers.authorization.split(' ')[1];

  // Authenticate with plain password of JWT
  // JWT is not very useful from CICD pipelines
  if (!(await verifyPassword(token))) {
    const secret = (await readStorage())[secretKey];

    try {
      const decoded = jwt.verify(token, secret);
      if (!(await verifyPassword(decoded))) {
        return res.status(401).send('Unauthorized');
      }
    } catch {
      return res.status(401).send('Unauthorized');
    }
  }

  next();
}

export const login = (docker: Docker, wss: WebSocket.Server) => 
  async (req: express.Request, res: express.Response) => {
    const password = req.body.password as string;

    if (!(await verifyPassword(password))) {
      return res.status(401).send('Unauthorized');
    }

    const secret = (await readStorage())[secretKey];

    res.send(jwt.sign(password, secret));
  };
