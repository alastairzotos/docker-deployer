#!/usr/bin/env node
import 'reflect-metadata';
import Container from 'typedi';
import { ResetController } from "./commands/reset/reset.controller";
import { StartController } from "./commands/start/start.controller";
import { StopController } from "./commands/stop/stop.controller";
import { Commands, CoreService } from './core';

export const handleCommand = async () => {
  await Container.get<CoreService>(CoreService).setup();

  const commands: Commands = {
    start: Container.get<StartController>(StartController),
    stop: Container.get<StopController>(StopController),
    reset: Container.get<ResetController>(ResetController)
  }

  const [cmd, ...args] = process.argv.slice(2)

  if (commands[cmd]) {
    await commands[cmd].run(...args);
  } else {
    console.error(`Unrecognised command '${cmd}'`);
    process.exit(1);
  }
};

handleCommand();
