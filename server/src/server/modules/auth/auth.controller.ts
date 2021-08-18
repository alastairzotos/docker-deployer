import * as express from 'express';
import { Service } from 'typedi';
import { AuthService } from './auth.service';

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  login = async (req: express.Request, res: express.Response) => {
    const password = req.body.password as string;

    const jwt = await this.authService.handleLogin(password);

    if (!jwt) {
      return res.status(401).send('Unauthorized');
    }

    res.send(jwt);
  };
}
