#!/usr/bin/env node
import { Commands } from "./core";
import { handleStart, handleStop, handleReset } from "./commands";
import { createStorage } from "./storage";

export const handleCommand = async () => {
  createStorage();
  
  const commands: Commands = {
    start: handleStart,
    stop: handleStop,
    reset: handleReset
  }

  const [cmd, ...args] = process.argv.slice(2)

  if (commands[cmd]) {
    commands[cmd](...args);
  } else {
    console.error(`Unrecognised command '${cmd}'`);
    process.exit(1);
  }
};

handleCommand();
