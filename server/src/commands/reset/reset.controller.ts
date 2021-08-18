import { CommandController } from "../../core";
import { ResetService } from "./reset.service";

export class ResetController implements CommandController {
  constructor(private readonly resetService: ResetService) {}

  async run() {
    await this.resetService.handleReset();
  }
}
