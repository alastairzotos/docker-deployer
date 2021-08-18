import { Docker } from 'node-docker-api';
import { Container } from 'node-docker-api/lib/container';
import * as WebSocket from 'ws';
import TimeAgo from 'javascript-time-ago';
import * as en from 'javascript-time-ago/locale/en'
import { sendMessage } from './messaging';
import { ContainerStatus, ContainerStatuses } from './models';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('es-US');

const toContainerStatus = async (container: Container): Promise<ContainerStatus> => {
  const status = await container.status();

  return {
    id: container.id,
    name: status.data['Name'].substr(1),
    pid: status.data['State'].Pid,
    port: container.data['Ports'].length ? container.data['Ports'][0]['PublicPort'] : -1,
    status: status.data['State'].Status,
    startedAt: timeAgo.format(new Date(status.data['State'].StartedAt).getTime())
  }
};

export const handleBroadcastStatus = async (docker: Docker, wss: WebSocket.Server) => {
  const containers = await docker.container.list({ all: true });

  const containerStatus = (await Promise.all(containers.map(toContainerStatus)))
    .reduce((acc, container) => ({
      ...acc,
      [container.id]: container
    }), {} as ContainerStatuses);

  sendMessage(wss, {
    type: 'containers',
    containerStatus
  });
}

export const broadcastStatus = (docker: Docker, wss: WebSocket.Server) => {
  setInterval(() => {
    handleBroadcastStatus(docker, wss);
  }, 5000);
};

