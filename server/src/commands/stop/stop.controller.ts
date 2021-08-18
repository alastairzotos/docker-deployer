import { Service } from "typedi";
import { CommandController } from "../../core";
import { StopService } from "./stop.service";

@Service()
export class StopController implements CommandController {
  constructor(private readonly stopService: StopService) {}

  async run() {
    await this.stopService.handleStop();
  }
}
