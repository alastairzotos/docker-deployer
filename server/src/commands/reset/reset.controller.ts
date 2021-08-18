import { Service } from "typedi";
import { CommandController } from "../../core";
import { ResetService } from "./reset.service";

@Service()
export class ResetController implements CommandController {
  constructor(private readonly resetService: ResetService) {}

  async run() {
    await this.resetService.handleReset();
  }
}
