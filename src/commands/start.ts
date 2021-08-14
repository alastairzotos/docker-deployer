import * as pm2 from 'pm2';
import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import { appendToStorage, readStorage } from '../storage';
import { cliName, processName, pwdKey } from "../core";

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


export const handleStart = async () => {
  await setupPassword();

  pm2.connect(error => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    pm2.start(
      {
        script: `${__dirname}/../server/index.js`,
        name: processName,
      },
      error => {
        if (error) {
          console.error(error.message);
          process.exit(1);
        }

        console.log(`Deployment server started. Run '${cliName} stop' to stop`);
        pm2.disconnect();
      }
    )
  })
}