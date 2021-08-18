import * as pm2 from 'pm2';
import { Service } from 'typedi';
import { CoreService } from "../../core";

@Service()
export class StopService {
  constructor(private readonly coreService: CoreService) { }

  handleStop = async () =>
    pm2.connect(async () => {
      try {
        await this.deleteProcess(this.coreService.serverProcessName);
        await this.deleteProcess(this.coreService.clientProcessName);
        pm2.disconnect();
        console.log('Mission Control stopped');
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });

  private deleteProcess = (name: string): Promise<void> =>
    new Promise((resolve, reject) => {
      pm2.stop(name, error => {
        if (error) {
          return reject(error.message);
        }

        pm2.delete(name, error => {
          if (error) {
            return reject(error.message);
          }

          resolve();
        })
      })
    })
}
