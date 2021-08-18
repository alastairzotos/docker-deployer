import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);
const rmdir = promisify(fs.rmdir);

export type Storage = { [key: string]: string };

export class StorageService {
  private readonly storagePath = path.resolve(__dirname, '..', '_storage');
  private readonly storageFilePath = path.resolve(this.storagePath, 'data.json');

  constructor() {}

  createStorage = async () => {
    if (!(await exists(this.storagePath))) {
      await mkdir(this.storagePath);
    }

    if (!(await exists(this.storageFilePath))) {
      await writeFile(this.storageFilePath, '{}');
    }
  }

  deleteStorage = async () => {
    if (await exists(this.storageFilePath)) {
      await rm(this.storageFilePath);
    }

    if (await exists(this.storagePath)) {
      await rmdir(this.storagePath);
    }
  }

  readStorage = async (): Promise<Storage> =>
    JSON.parse((await readFile(this.storageFilePath)).toString());

  writeStorage = async (data: Storage) =>
    await writeFile(this.storageFilePath, JSON.stringify(data, null, 2))

  appendStorage = async (data: Storage) =>
    await this.writeStorage({ ...(await this.readStorage()), ...data })
}
