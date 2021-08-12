import * as child_process from 'child_process';
import { cliName } from "../core";
import { setupApiKey } from "../security";
import { appendToStorage, readStorage } from "../storage";

export const handleStart = async () => {
  const storage = readStorage();
  await setupApiKey(storage);

  const child = child_process.spawn('node', [`${__dirname}/../server.js`], { stdio: 'ignore', detached: true });
  child.unref();

  await appendToStorage({ PID: String(child.pid) });

  console.log(`Deployment server started. PID: ${child.pid}`);
  console.log(`Type '${cliName} stop' to stop`);
}
