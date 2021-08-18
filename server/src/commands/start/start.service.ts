import * as pm2 from 'pm2';
import * as readline from 'readline-sync';
import * as bcrypt from 'bcryptjs';
import * as ip from 'ip';
import { CoreService } from "../../core";
import { Service } from 'typedi';

@Service()
export class StartService {
  constructor(private readonly coreService: CoreService) { }

  handleStart = async () => {
    await this.setupPassword();

    try {
      pm2.connect(async error => {
        if (error) {
          console.error(error.message);
          process.exit(1);
        }

        await this.startScript(this.coreService.serverPath, this.coreService.serverProcessName);
        console.log(`Deployment server started. Run '${this.coreService.cliName} stop' to stop`);

        await this.startScript(this.coreService.clientPath, this.coreService.clientProcessName);

        console.log(`Client UI running on http://${ip.address()}:4044`);
        pm2.disconnect();
      })
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  private startScript = (script: string, name: string): Promise<void> =>
    new Promise((resolve, reject) => {
      pm2.start({ script, name }, error => {
        if (error) {
          return reject(error.message);
        }

        resolve();
      })
    })

  private setupPassword = async () => {
    if (!(await this.coreService.readPasswordHash())) {
      console.log('Enter a password for this server');
      console.log('You will need to provide this as your bearer token when deploying your containers')

      let password1 = readline.question('Enter password: ', { hideEchoBack: true });
      let password2 = readline.question('Confirm password: ', { hideEchoBack: true });

      while (password1 !== password2) {
        console.log('Passwords don\'t match, please try again.');
        password1 = readline.question('Enter password: ', { hideEchoBack: true });
        password2 = readline.question('Confirm password: ', { hideEchoBack: true });
      }

      await this.coreService.writePasswordHash(await bcrypt.hash(password1, await bcrypt.genSalt(10)));
    }
  }
}