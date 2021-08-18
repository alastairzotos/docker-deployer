import { CommandController } from "../../core";
import { StopService } from "./stop.service";

export class StopController implements CommandController {
  constructor(private readonly stopService: StopService) {}

  async run() {
    await this.stopService.handleStop();
  }
}
