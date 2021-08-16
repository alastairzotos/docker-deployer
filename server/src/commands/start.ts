import * as pm2 from 'pm2';
import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import { appendStorage, readStorage } from '../storage';
import { cliName, serverProcessName, pwdKey, clientProcessName } from "../core";
import { clientPath, serverPath } from '../root';

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

    await appendStorage({ [pwdKey]: await bcrypt.hash(password1, await bcrypt.genSalt(10)) });
  }
}

const startScript = (script: string, name: string): Promise<void> =>
  new Promise((resolve, reject) => {
    pm2.start({ script, name }, error => {
      if (error) {
        return reject(error.message);
      }
      
      resolve();
    })
  })

export const handleStart = async () => {
  await setupPassword();

  try {
    pm2.connect(async error => {
      if (error) {
        console.error(error.message);
        process.exit(1);
      }

      console.log(clientPath);
      await startScript(serverPath, serverProcessName);
      console.log(`Deployment server started. Run '${cliName} stop' to stop`);

      await startScript(clientPath, clientProcessName);
      console.log(`Client UI running on http://localhost:4044`);

      pm2.disconnect();

      // pm2.start(
      //   {
      //     script: serverPath,
      //     name: serverProcessName,
      //   },
      //   error => {
      //     if (error) {
      //       console.error(error.message);
      //       process.exit(1);
      //     }

      //     console.log(`Deployment server started. Run '${cliName} stop' to stop`);
      //     pm2.disconnect();
      //   }
      // )
    })
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}