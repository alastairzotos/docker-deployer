import * as path from 'path';
import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from "./storage.service";

@Service()
export class CoreService {
  private readonly pwdKey = 'PASSWORD_HASH';
  private readonly secretKey = 'SECRET';

  readonly cliName = 'mctrl';
  readonly serverProcessName = 'mctrl-server';
  readonly clientProcessName = 'mctrl-client';

  readonly serverPath = path.resolve(__dirname, '..', 'server', 'index.js');
  readonly clientPath = path.resolve(__dirname, '..', '..', '..', 'client', 'serve.js');

  constructor(private readonly storageService: StorageService) { }

  setup = async () => {
    await this.storageService.createStorage();
    await this.createSecret();
  }

  readSecret = async () => (await this.storageService.readStorage())[this.secretKey];
  readPasswordHash = async () => (await this.storageService.readStorage())[this.pwdKey];

  writePasswordHash = async (pwdHash: string) =>
    await this.storageService.appendStorage({ [this.pwdKey]: pwdHash });

  private createSecret = async () => {
    const storage = await this.storageService.readStorage();

    if (!storage[this.secretKey]) {
      await this.storageService.appendStorage({ [this.secretKey]: uuidv4() });
    }
  }
}
