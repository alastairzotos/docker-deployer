import * as express from 'express';
import { Docker } from 'node-docker-api';
import * as http from 'http';
import * as WebSocket from 'ws';
import { createStorage } from '../storage';
import { authenticate } from './auth';
import { handleDeploy } from './handleDeploy'; 
import { sendMessage } from './messaging';

export const startServer = async () => {
  const port = 4042;
  const wsPort = 4043;
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });

  await createStorage();
  const app = express();

  const wsHttpServer = http.createServer(app);
  const wss = new WebSocket.Server({ server: wsHttpServer });

  app.use(express.json());

  app.post('/deploy', authenticate, async (req, res) => {
    const { image, tag = 'latest', name, ports } = req.body;

    const logs = [];
    await handleDeploy(
      docker,
      image,
      tag,
      name,
      ports,
      line => {
        logs.push(line);
        
        sendMessage(wss, {
          type: 'log',
          log: {
            container: name,
            date: new Date(),
            message: line
          }
        })
      }
    );

    res.json({ response: logs });
  })

  wsHttpServer.listen(wsPort, () => console.log(`Websocket server listening on ws://localhost:${wsPort}`))
  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
