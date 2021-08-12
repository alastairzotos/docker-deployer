import * as path from 'path';
import * as fs from 'fs';

export const storagePath = path.resolve(__dirname, 'storage');
export const storageFilePath = path.resolve(storagePath, '.data');

export type Storage = { [key: string]: string };

export const readStorage = (): Storage => {
  if (fs.existsSync(storageFilePath)) {
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
  
  throw new Error('Cannot find storage file');
}

export const appendToStorage = (data: Storage) => {
  const storage = readStorage();

  const newData = { ...storage, ...data };
  const dataStr = Object.keys(newData)
    .reduce((items, key) => (
      [...items, `${key}=${newData[key]}`]
        .filter(item => item.trim().length > 0)
    ), [])
    .join('\n');

  fs.writeFileSync(storageFilePath, dataStr);
}


export const setupStorage = (): Storage => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }

  if (!fs.existsSync(storageFilePath)) {
    fs.writeFileSync(storageFilePath, '');

    return {};
  }
  
  return readStorage();
}
