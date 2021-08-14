import * as express from 'express';
import * as bcrypt from 'bcryptjs';
import { pwdKey } from '../core';
import { createStorage, readStorage } from '../storage';
import { spawnProcess } from './proc';

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const pwdHash = (await readStorage())[pwdKey];
  const headers = req.headers;

  if (!headers || !headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = headers.authorization.split(' ')[1];

  if (!(await bcrypt.compare(token, pwdHash))) {
    return res.status(401).send('Unauthorized');
  }

  next();
}

const handleDeploy = async (
  image: string,
  tag: string,
  name: string,
  ports: string,
) => {
  let logs = [];

  await spawnProcess('docker', ['pull', `${image}:${tag}`], logs);
  await spawnProcess('docker', ['stop', name], logs);
  await spawnProcess('docker', ['rm', name], logs);
  await spawnProcess('docker', ['run', '-d', '-p', ports, '--name', name, `${image}:${tag}`], logs);

  return logs.join('\n');
}

export const startServer = async () => {
  const port = 4042;

  await createStorage();
  const app = express();

  app.use(express.json());

  app.post('/deploy', authenticate, async (req, res) => {
    const { image, tag = 'latest', name, ports } = req.body;

    const result = await handleDeploy(image, tag, name, ports);

    res.json({ response: result });
  })

  app.listen(port, () => `Listening on http://localhost:${port}`);
};

startServer();
