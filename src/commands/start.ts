import * as pm2 from 'pm2';
import { cliName, processName } from "../core";
import { setupPassword } from "../security";

export const handleStart = async () => {
  await setupPassword();

  pm2.connect(error => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    pm2.start(
      {
        script: `${__dirname}/../server.js`,
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
