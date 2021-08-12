import { cliName } from "../core";
import { readStorage } from "../storage";

export const handleStop = async () => {
  const storage = await readStorage();

  if (!storage['PID']) {
    console.log(`'${cliName}' is not currently running. Run '${cliName} start' to start the deployment server`);
    process.exit(1);
  }

  process.kill(parseInt(storage['PID']), 9);
};
