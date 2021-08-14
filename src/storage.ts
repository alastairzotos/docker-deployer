import * as path from 'path';
import * as fs from 'fs';

const storagePath = path.resolve(__dirname, 'storage');
const storageFilePath = path.resolve(storagePath, '.data');

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


export const createStorage = () => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }

  if (!fs.existsSync(storageFilePath)) {
    fs.writeFileSync(storageFilePath, '');
  }
}

export const deleteStorage = () => {
  if (fs.existsSync(storageFilePath)) {
    fs.rmSync(storageFilePath);
  }

  if (fs.existsSync(storagePath)) {
    fs.rmdirSync(storagePath);
  }
}

export const readStorage = (): Storage => {
  const data = fs.readFileSync(storageFilePath).toString();

  if (data.length === 0) {
    return {};
  }

  return stringToObject(data.toString());
}

export const appendToStorage = (data: Storage) => 
  fs.writeFileSync(
    storageFilePath,
    objectToString({ ...readStorage(), ...data })
  );
