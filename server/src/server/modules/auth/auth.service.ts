import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { CoreService } from '../../../core';

@Service()
export class AuthService {
  constructor(private readonly coreService: CoreService) {}

  handleLogin = async (password: string) => {
    if (!(await this.verifyPassword(password))) {
      return null;
    }

    const secret = this.coreService.readSecret();

    return jwt.sign(password, secret);
  }

  verifyPassword = async (password: string) => {
    const pwdHash = await this.coreService.readPasswordHash();
  
    return await bcrypt.compare(password, pwdHash);
  }
}
