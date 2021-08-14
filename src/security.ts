import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import { appendToStorage, readStorage } from "./storage";
import { pwdKey } from './core';

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

export const setupPassword = async () => {
  const storage = await readStorage();

  if (!storage[pwdKey]) {
    console.log('Enter a password for this server');
    console.log('You will need to provide this as your bearer token when deploying your containers')

    let password1 = readline.question('Enter password: ', { hideEchoBack: true });
    let password2 = readline.question('Confirm password: ', { hideEchoBack: true });

    while (password1 !== password2) {
      console.log('Passwords don\'t match, please try again.');
      password1 = readline.question('Enter password: ', { hideEchoBack: true });
      password2 = readline.question('Confirm password: ', { hideEchoBack: true });
    }

    await appendToStorage({ [pwdKey]: await bcrypt.hash(password1, await bcrypt.genSalt(10)) });
  }
}
