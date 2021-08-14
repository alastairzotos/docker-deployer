import * as express from 'express';
import { spawnProcess } from './proc';
import { authenticate } from './security';
import { createStorage } from './storage';

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
