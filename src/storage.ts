import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const storagePath = path.resolve(__dirname, 'storage');
const storageFilePath = path.resolve(storagePath, '.data');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);
const rmdir = promisify(fs.rmdir);

export type Storage = { [key: string]: string };

const objectToString = (data: Storage): string =>
  Object.keys(data)
    .reduce((items, key) => (
      [...items, `${key}=${data[key]}`]
    ), [] as string[])
    .filter(line => line.length > 0)
    .join('\n');

const stringToObject = (str: string): Storage =>
  str
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.split('='))
    .reduce((acc, item) => ({
      ...acc,
      [item[0]]: item[1]
    }), {})


export const createStorage = async () => {
  if (!(await exists(storagePath))) {
    await mkdir(storagePath);
  }

  if (!(await exists(storageFilePath))) {
    await writeFile(storageFilePath, '');
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

export const readStorage = async (): Promise<Storage> => {
  const data = (await readFile(storageFilePath)).toString();

  if (data.length === 0) {
    return {};
  }

  return stringToObject(data.toString());
}

export const appendToStorage = async (data: Storage) => 
  await writeFile(
    storageFilePath,
    objectToString({ ...(await readStorage()), ...data })
  );
