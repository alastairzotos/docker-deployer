import * as express from 'express';
import { Docker } from 'node-docker-api';
import { createStorage } from '../storage';
import { authenticate } from './auth';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const promisifyStream = (stream) => new Promise((resolve, reject) => {
  stream.on('data', (d) => console.log(d.toString()))
  stream.on('end', resolve)
  stream.on('error', reject)
})

const handleDeploy = async (
  image: string,
  tag: string,
  name: string,
  ports: string,
  log: (data: string) => void,
) => {
  try {
    log('Pulling image...');
    await docker.image.create({}, { fromImage: image, tag })//.then(stream => promisifyStream(stream));

    const containers = await docker.container.list();
    const existingContainer = containers.find(container => container.data['Names'][0] === name || container.data['Names'][0] === '/' + name);

    if (!!existingContainer) {
      log('Removing existing container...');
      await existingContainer.stop();
      await existingContainer.delete();
    }

    const [outPort, inPort] = ports.split(':');

    log('Starting new container...');
    const container = await docker.container.create({
      Image: image + ':' + tag,
      name,
      PortBindings: {
        [`${inPort}/tcp`]: [{ HostPort: String(outPort) }]
      },
      ExposedPorts: {
        [`${inPort}/tcp`]: {}
      }
    });

    await container.start();

    log('Success');
  } catch (e) {
    log(String(e));
  }
}

export const startServer = async () => {
  const port = 4042;

  await createStorage();
  const app = express();

  app.use(express.json());

  app.post('/deploy', authenticate, async (req, res) => {
    const { image, tag = 'latest', name, ports } = req.body;

    const logs = [];
    await handleDeploy(
      image,
      tag,
      name,
      ports,
      line => {
        logs.push(line);
        console.log(line);
      }
    );

    res.json({ response: logs });
  })

  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
};

startServer();
