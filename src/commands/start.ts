import * as pm2 from 'pm2';
import { cliName, processName } from "../core";
import { setupApiKey } from "../security";
import { readStorage } from "../storage";

export const handleStart = async () => {
  const storage = readStorage();
  await setupApiKey(storage);

  pm2.connect(error => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    pm2.start(
      {
        script: `${__dirname}/../server.js`,
        name: processName
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
