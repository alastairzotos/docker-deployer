#!/usr/bin/env node
import { Commands } from "./core";
import { handleStart } from "./start";
import { handleStop } from "./stop";

export const handleCommand = async () => {
  const [cmd, ...args] = process.argv.slice(2)

  const commands: Commands = {
    start: handleStart,
    stop: handleStop
  }

  if (commands[cmd]) {
    commands[cmd](...args);
  } else {
    console.error(`Unrecognised command '${cmd}'`);
    process.exit(1);
  }
};

handleCommand();
