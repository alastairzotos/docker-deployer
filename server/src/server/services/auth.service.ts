import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { pwdKey, secretKey } from "../../core";
import { readStorage } from "../../storage";

export class AuthService {
  constructor() {}

  handleLogin = async (password: string) => {
    if (!(await this.verifyPassword(password))) {
      return null;
    }

    const secret = (await readStorage())[secretKey];

    return jwt.sign(password, secret);
  }

  verifyPassword = async (password: string) => {
    const pwdHash = (await readStorage())[pwdKey];
  
    return await bcrypt.compare(password, pwdHash);
  }
}