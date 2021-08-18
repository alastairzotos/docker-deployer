import * as express from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly service: AuthService) { }

  login = async (req: express.Request, res: express.Response) => {
    const password = req.body.password as string;

    const jwt = await this.service.handleLogin(password);

    if (!jwt) {
      return res.status(401).send('Unauthorized');
    }

    res.send(jwt);
  };
}