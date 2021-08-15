import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const storagePath = path.resolve(__dirname, '..', '_storage');
const storageFilePath = path.resolve(storagePath, 'data.json');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);
const rmdir = promisify(fs.rmdir);

export type Storage = { [key: string]: string };

export const createStorage = async () => {
  if (!(await exists(storagePath))) {
    await mkdir(storagePath);
  }

  if (!(await exists(storageFilePath))) {
    await writeFile(storageFilePath, '{}');
  }
}

export const deleteStorage = async () => {
  if (await exists(storageFilePath)) {
    await rm(storageFilePath);
  }

  if (await exists(storagePath)) {
    await rmdir(storagePath);
  }
}

export const readStorage = async (): Promise<Storage> =>
  JSON.parse((await readFile(storageFilePath)).toString());

export const writeStorage = async (data: Storage) =>
  await writeFile(storageFilePath, JSON.stringify(data, null, 2))

export const appendStorage = async (data: Storage) => 
  await writeStorage({ ...(await readStorage()), ...data})
