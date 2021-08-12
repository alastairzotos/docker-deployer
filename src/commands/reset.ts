import { deleteStorage } from '../storage';
import { handleStop } from './stop';
import * as rl from 'readline-sync';

export const handleReset = async () => {
  if (rl.question('You are about to reset, which means losing your passwords and shutting down your process. Continue? (y/n) ').toLowerCase() === 'y') {
    try {
      await handleStop();
    } catch {}
    
    deleteStorage();
  }
};
