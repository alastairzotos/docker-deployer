import * as readline from 'readline-sync';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { appendToStorage, readStorage, Storage } from "./storage";
const keypair = require('keypair'); // Stupid

const keyPath = path.resolve(__dirname, 'private');
const publicKeyFilePath = path.resolve(keyPath, 'public_key.pem');
const privateKeyFilePath = path.resolve(keyPath, 'private_key.pem');

interface Keys {
  privateKey: string;
  publicKey: string;
}

const getKeys = async (): Promise<Keys> => {
  if (!fs.existsSync(privateKeyFilePath)) {
    const keys = keypair();

    const privateKey = keys.private;
    const publicKey = keys.public;

    fs.writeFileSync(privateKeyFilePath, privateKey);
    fs.writeFileSync(publicKeyFilePath, publicKey);

    return { privateKey, publicKey };
  } else {
    const privateKey = fs.readFileSync(privateKeyFilePath).toString();
    const publicKey = fs.readFileSync(publicKeyFilePath).toString();

    return { privateKey, publicKey };
  }
}

const sign = async (data: string) => {
  const { privateKey } = await getKeys();
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(Buffer.from(data));
  return sign.sign(privateKey, 'base64');
}

export const verify = async (data: string) => {
  const { publicKey } = await getKeys();
  const { API_KEY } = await readStorage();
  
  const verify = crypto.createVerify('RSA-SHA256');
  verify.write(Buffer.from(data));
  verify.end();
  return verify.verify(publicKey, API_KEY, 'base64');
}

export const setupApiKey = async (storage: Storage) => {
  if (!fs.existsSync(keyPath)) {
    fs.mkdirSync(keyPath);
  }

  if (!storage['API_KEY']) {
    console.log('Enter a password for this server');
    console.log('You will need to provide this as your bearer token when deploying your containers')

    let password1 = readline.question('Enter password: ', { hideEchoBack: true });
    let password2 = readline.question('Confirm password: ', { hideEchoBack: true });

    while (password1 !== password2) {
      console.log('Passwords don\'t match, please try again.');
      password1 = readline.question('Enter password: ', { hideEchoBack: true });
      password2 = readline.question('Confirm password: ', { hideEchoBack: true });
    }

    await appendToStorage({ API_KEY: await sign(password1) });
  }
}
