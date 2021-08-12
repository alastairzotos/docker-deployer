import * as path from 'path';
import * as fs from 'fs';

const storagePath = path.resolve(__dirname, 'storage');
const storageFilePath = path.resolve(storagePath, '.data');

export type Storage = { [key: string]: string };

export const setupStorage = () => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }

  if (!fs.existsSync(storageFilePath)) {
    fs.writeFileSync(storageFilePath, '');
  }
}

export const readStorage = (): Storage => {
  const data = fs.readFileSync(storageFilePath).toString();

  if (data.length === 0) {
    return {};
  }

  return data.toString()
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.split('='))
    .reduce((acc, item) => ({
      ...acc,
      [item[0]]: item[1]
    }), {});
}

export const appendToStorage = (data: Storage) => {
  const storage = readStorage();

  const newData = { ...storage, ...data };
  const dataStr = Object.keys(newData)
    .reduce((items, key) => (
      [...items, `${key}=${newData[key]}`]
    ), [] as string[])
    .filter(line => line.length > 0)
    .join('\n');

  fs.writeFileSync(storageFilePath, dataStr);
}

export const deleteStorage = () => {
  if (fs.existsSync(storageFilePath)) {
    fs.rmSync(storageFilePath);
  }

  if (fs.existsSync(storagePath)) {
    fs.rmdirSync(storagePath);
  }
}
