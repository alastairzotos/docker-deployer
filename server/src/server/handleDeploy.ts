import { Docker } from 'node-docker-api';
import * as WebSocket from 'ws';
import { handleBroadcastStatus } from './broadcastStatus';
import { promisifyStream } from './utils';

export const handleDeploy = async (
  docker: Docker,
  wss: WebSocket.Server,
  image: string,
  tag: string,
  name: string,
  ports: string,
  log: (data: string) => void,
) => {
  try {
    log('Pulling image...');
    await docker.image.create({}, { fromImage: image, tag }).then(stream => promisifyStream(stream, log));

    const containers = await docker.container.list();
    const existingContainer = containers.find(container => container.data['Names'][0] === name || container.data['Names'][0] === '/' + name);

    if (!!existingContainer) {
      log('Removing existing container...');
      await existingContainer.stop();
      await handleBroadcastStatus(docker, wss);
      await existingContainer.delete();
      await handleBroadcastStatus(docker, wss);
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

    await handleBroadcastStatus(docker, wss);
    await container.start();
    await handleBroadcastStatus(docker, wss);

    log('Success');
  } catch (e) {
    log(String(e));
  }
}