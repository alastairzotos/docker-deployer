import * as express from 'express';
import * as cors from 'cors';
import { Docker } from 'node-docker-api';
import * as http from 'http';
import * as WebSocket from 'ws';
import { createStorage } from '../storage';
import { AuthMiddleware } from './middleware/auth';
import { MainController } from './controllers/main.controller';
import { MainService } from './services/main.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MessagingService } from './services/messaging.service';
import { DockerService } from './services/docker.service';
import { LogService } from './services/log.service';

export const startServer = async () => {
  const port = 4042;
  const wsPort = 4043;
  
  await createStorage();
  
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

  const authService = new AuthService();

  const authController = new AuthController(authService);
  const authMiddleware = new AuthMiddleware(authService);

  mainService.broadcastStatusContinuously();

  app.post('/login', authController.login);
  app.post('/deploy', authMiddleware.authenticate, mainController.deploy);
  app.post('/trigger-broadcast', authMiddleware.authenticate, mainController.triggerBroadcast);

  wsHttpServer.listen(wsPort, () => console.log(`Websocket server listening on ws://localhost:${wsPort}`))
  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
