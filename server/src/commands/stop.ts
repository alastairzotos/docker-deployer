import * as pm2 from 'pm2';
import { serverProcessName } from "../core";

export const handleStop = async () => {
  pm2.connect(() => {
    pm2.stop(serverProcessName, error => {
      if (error) {
        console.error(error);
        process.exit(1);
      }

      pm2.delete(serverProcessName, error => {
        if (error) {
          console.error(error);
          process.exit(1);
        }

        pm2.disconnect();
        console.log('Deployment server stopped');
      })
    })
  })
};
