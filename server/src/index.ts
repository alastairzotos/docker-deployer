#!/usr/bin/env node
import { v4 as uuidv4 } from 'uuid';
import { Commands, secretKey } from "./core";
import { handleStart, handleStop, handleReset } from "./commands";
import { appendStorage, createStorage, readStorage } from "./storage";

const createSecret = async () => {
  const storage = await readStorage();

  if (!storage[secretKey]) {
    await appendStorage({ [secretKey]: uuidv4() });
  }
}

export const handleCommand = async () => {
  await createStorage();
  await createSecret();
  
  const commands: Commands = {
    start: handleStart,
    stop: handleStop,
    reset: handleReset
  }

  const [cmd, ...args] = process.argv.slice(2)

  if (commands[cmd]) {
    await commands[cmd](...args);
  } else {
    console.error(`Unrecognised command '${cmd}'`);
    process.exit(1);
  }
};

handleCommand();
