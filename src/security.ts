import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import { appendToStorage, readStorage, Storage } from "./storage";

export const verify = async (password: string) => {
  const { API_KEY } = await readStorage();
  
  return await bcrypt.compare(password, API_KEY);
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
