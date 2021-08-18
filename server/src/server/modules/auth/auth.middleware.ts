import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { CoreService } from '../../../core';
import { AuthService } from './auth.service';

export class AuthMiddleware  {
  constructor(
    private readonly coreService: CoreService,
    private readonly service: AuthService
  ) {}

  authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const headers = req.headers;
  
    if (!headers || !headers.authorization || !headers.authorization.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized');
    }
  
    const token = headers.authorization.split(' ')[1];
  
    // Authenticate with plain password of JWT
    // JWT is not very useful from CICD pipelines
    if (!(await this.service.verifyPassword(token))) {
      const secret = await this.coreService.readSecret();
  
      try {
        const decoded = jwt.verify(token, secret);
        if (!(await this.service.verifyPassword(decoded))) {
          return res.status(401).send('Unauthorized');
        }
      } catch {
        return res.status(401).send('Unauthorized');
      }
    }
  
    next();
  }  
}
