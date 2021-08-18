import * as rl from 'readline-sync';
import { StorageService } from '../../core';
import { StopService } from '../stop/stop.service';

export class ResetService {
  constructor(
    private readonly stopService: StopService,
    private readonly storageService: StorageService,
  ) {}

  handleReset = async () => {
    if (rl.question('You are about to reset, which means losing your passwords and shutting down your process. Continue? (y/n) ').toLowerCase() === 'y') {
      try {
        await this.stopService.handleStop();
      } catch {}
  
      await this.storageService.deleteStorage();
    }
  }
}