import * as readline from 'readline-sync';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { appendToStorage, readStorage, Storage } from "./storage";
// import { keypair } from 'keypair';
const keypair = require('keypair');

const passphrase = () => 'the-passphrase';

const keyPath = path.resolve(__dirname, 'private');
const publicKeyFilePath = path.resolve(keyPath, 'public_key.pem');
const privateKeyFilePath = path.resolve(keyPath, 'private_key.pem');

export const createPrivatePath = () => {
  if (!fs.existsSync(keyPath)) {
    fs.mkdirSync(keyPath);
  }
}

interface Keys {
  privateKey: string;
  publicKey: string;
}

// const generateKeys = (): Promise<Keys> =>
//   new Promise((resolve, reject) => {
//     crypto.generateKeyPair('rsa', {
//       modulusLength: 4096,
//       publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem'
//       },
//       privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//         cipher: 'aes-256-cbc',
//         passphrase: passphrase()
//       }
//     }, (err, publicKey, privateKey) => {
//       if (err) {
//         return reject(err);
//       }

//       resolve({ publicKey, privateKey });
//     });
//   })


const getKeys = async (): Promise<Keys> => {
  if (!fs.existsSync(privateKeyFilePath)) {
    // const { privateKey, publicKey } = await generateKeys();

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
  return sign.sign({ key: privateKey, passphrase: passphrase() }, 'base64');
}

export const verify = async (data: string) => {
  const { publicKey } = await getKeys();
  const { API_KEY } = await readStorage();
  
  const verify = crypto.createVerify('RSA-SHA256');
  verify.write(Buffer.from(data));
  verify.end();
  return verify.verify(publicKey, API_KEY, 'base64');
}

export const getApiKey = async (storage: Storage): Promise<string> => {
  createPrivatePath();

  if (!storage['API_KEY']) {
    console.log('Enter a password for this server');
    console.log('You will need to provide this as your bearer token when deploying your containers')

    let password1 = readline.question('Enter password: ', { hideEchoBack: true });
    let password2 = readline.question('Enter password again: ', { hideEchoBack: true });

    while (password1 !== password2) {
      console.log('Passwords don\'t match, please try again.');
      password1 = readline.question('Enter password: ', { hideEchoBack: true });
      password2 = readline.question('Enter password again: ', { hideEchoBack: true });
    }

    const signed = await sign(password1);

    await appendToStorage({ API_KEY: signed });

    return signed;
  }

  return storage['API_KEY'];
}
