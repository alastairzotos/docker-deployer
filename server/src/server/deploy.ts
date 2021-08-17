import * as express from 'express';
import { Docker } from 'node-docker-api';
import * as WebSocket from 'ws';
import { handleDeploy } from './handleDeploy';
import { sendMessage } from './messaging';

export const deploy = (docker: Docker, wss: WebSocket.Server) =>
  async (req: express.Request, res: express.Response) => {
    const { image, tag = 'latest', name, ports } = req.body;

    const logs = [];
    await handleDeploy(
      docker,
      wss,
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
      },
      (type, id, current, total) =>
        sendMessage(wss, {
          type: 'log',
          log: {
            container: name,
            progress: { type, id, current, total }
          }
        })
    );

    res.json({ response: logs });
  };
