import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import { appendToStorage, readStorage, Storage } from "./storage";

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { API_KEY } = readStorage();
  const headers = req.headers;

  if (!headers || !headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = headers.authorization.split(' ')[1];

  if (!(await bcrypt.compare(token, API_KEY))) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

export const setupApiKey = async (storage: Storage) => {
  if (!storage['API_KEY']) {
    console.log('Enter a password for this server');
    console.log('You will need to provide this as your bearer token when deploying your containers')

    let password1 = readline.question('Enter password: ', { hideEchoBack: true });
    let password2 = readline.question('Confirm password: ', { hideEchoBack: true });

    while (password1 !== password2) {
      console.log('Passwords don\'t match, please try again.');
      password1 = readline.question('Enter password: ', { hideEchoBack: true });
      password2 = readline.question('Confirm password: ', { hideEchoBack: true });
    }

    await appendToStorage({ API_KEY: await bcrypt.hash(password1, await bcrypt.genSalt(10)) });
  }
}
