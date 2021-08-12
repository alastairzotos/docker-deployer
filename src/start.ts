import * as child_process from 'child_process';
import { cliName } from "./core";
import { getApiKey } from "./security";
import { appendToStorage, setupStorage } from "./storage";

export const handleStart = async () => {
  const storage = setupStorage();
  await getApiKey(storage);

  const child = child_process.spawn('node', [`${__dirname}/server.js`], { stdio: 'ignore', detached: true });
  child.unref();

  await appendToStorage({ PID: String(child.pid) });

  console.log(`Deployment server started. PID: ${child.pid}`);
  console.log(`Type '${cliName} stop' to stop`);
}
