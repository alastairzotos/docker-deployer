#!/usr/bin/env node
import { ResetController } from "./commands/reset/reset.controller";
import { ResetService } from "./commands/reset/reset.service";
import { StartController } from "./commands/start/start.controller";
import { StartService } from "./commands/start/start.service";
import { StopController } from "./commands/stop/stop.controller";
import { StopService } from "./commands/stop/stop.service";
import { Commands, coreService, storageService } from "./core";

export const handleCommand = async () => {
  await coreService.setup();

  const startService = new StartService(coreService);
  const stopService = new StopService(coreService);
  const resetService = new ResetService(stopService, storageService);

  const commands: Commands = {
    start: new StartController(startService),
    stop: new StopController(stopService),
    reset: new ResetController(resetService)
  };

  const [cmd, ...args] = process.argv.slice(2)

  if (commands[cmd]) {
    await commands[cmd].run(...args);
  } else {
    console.error(`Unrecognised command '${cmd}'`);
    process.exit(1);
  }
};

handleCommand();
