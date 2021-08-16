import * as pm2 from 'pm2';
import { clientProcessName, serverProcessName } from "../core";

const deleteProcess = (name: string): Promise<void> =>
  new Promise((resolve, reject) => {
    pm2.stop(name, error => {
      if (error) {
        return reject(error);
      }

      pm2.delete(name, error => {
        if (error) {
          return reject(error);
        }

        resolve();
      })
    })
  })

export const handleStop = async () => {
  pm2.connect(async () => {
    await deleteProcess(serverProcessName);
    await deleteProcess(clientProcessName);
    pm2.disconnect();
    console.log('Mission Control stopped');
  });
};
