import * as express from 'express';
import * as cors from 'cors';
import { Docker } from 'node-docker-api';
import * as http from 'http';
import * as WebSocket from 'ws';
import { createStorage } from '../storage';
import { authenticate, login } from './auth';
import { broadcastStatus, handleBroadcastStatus } from './broadcastStatus';
import { deploy } from './deploy';

export const startServer = async () => {
  const port = 4042;
  const wsPort = 4043;
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });

  await createStorage();
  const app = express();
  app.use(express.json());
  app.use(cors());

  const wsHttpServer = http.createServer(app);
  const wss = new WebSocket.Server({ server: wsHttpServer });

  broadcastStatus(docker, wss);

  app.post('/login', login(docker, wss));
  app.post('/deploy', authenticate, deploy(docker, wss));
  app.post('/trigger-broadcast', authenticate, async (req, res) => {
    await handleBroadcastStatus(docker, wss);
    res.sendStatus(201);
  });

  wsHttpServer.listen(wsPort, () => console.log(`Websocket server listening on ws://localhost:${wsPort}`))
  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
