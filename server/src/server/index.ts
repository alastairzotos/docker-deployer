import * as express from 'express';
import * as cors from 'cors';
import { Docker } from 'node-docker-api';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AuthMiddleware } from './middleware/auth';
import { MainController } from './controllers/main.controller';
import { coreService } from '../core';
import { MessagingService } from './modules/messaging/messaging.service';
import { LogService } from './modules/log/log.service';
import { DockerService } from './modules/docker/docker.service';
import { MainService } from './modules/main/main.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './controllers/auth.controller';

export const startServer = async () => {
  const port = 4042;
  const wsPort = 4043;
  
  const app = express();
  app.use(express.json());
  app.use(cors());
  
  const wsHttpServer = http.createServer(app);
  const wss = new WebSocket.Server({ server: wsHttpServer });
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });

  const messagingService = new MessagingService(wss);
  const logService = new LogService(messagingService);
  const dockerService = new DockerService(docker, messagingService, logService);
  
  const mainService = new MainService(dockerService, messagingService, logService);
  const mainController = new MainController(mainService);

  const authService = new AuthService(coreService);
  const authController = new AuthController(authService);
  const authMiddleware = new AuthMiddleware(coreService, authService);
  
  mainService.broadcastStatusContinuously();

  app.post('/login', authController.login);
  app.post('/deploy', authMiddleware.authenticate, mainController.deploy);
  app.post('/trigger-broadcast', authMiddleware.authenticate, mainController.triggerBroadcast);

  wsHttpServer.listen(wsPort, () => console.log(`Websocket server listening on ws://localhost:${wsPort}`))
  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
