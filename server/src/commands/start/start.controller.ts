import { Service } from "typedi";
import { CommandController } from "../../core";
import { StartService } from './start.service';

@Service()
export class StartController implements CommandController {
  constructor(private readonly startService: StartService) {}

  async run() {
    await this.startService.handleStart();
  }
}
