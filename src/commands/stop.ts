import { cliName } from "../core";
import { setupStorage } from "../storage";

export const handleStop = async () => {
  const storage = await setupStorage();

  if (!storage['PID']) {
    console.log(`'${cliName}' is not currently running. Run '${cliName} start' to start the deployment server`);
    process.exit(1);
  }

  process.kill(parseInt(storage['PID']), 9);
};
