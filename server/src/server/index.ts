import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import Container from 'typedi';
import { MainService } from './modules/main/main.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { MainController } from './modules/main/main.controller';
import { MessagingService } from './modules/messaging/messaging.service';

export const startServer = async () => {
  const port = 4042;
  const wsPort = 4043;
  
  const app = express();
  app.use(express.json());
  app.use(cors());

  const messagingService = Container.get<MessagingService>(MessagingService);
  messagingService.setup(app);

  const mainService = Container.get<MainService>(MainService);
  const authController = Container.get<AuthController>(AuthController);
  const authMiddleware = Container.get<AuthMiddleware>(AuthMiddleware);
  const mainController = Container.get<MainController>(MainController);
  
  mainService.broadcastStatusContinuously();

  app.post('/login', authController.login);
  app.post('/deploy', authMiddleware.authenticate, mainController.deploy);
  app.post('/trigger-broadcast', authMiddleware.authenticate, mainController.triggerBroadcast);

  messagingService
    .httpServer.listen(wsPort, () => console.log(`Websocket server listening on ws://localhost:${wsPort}`));

  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
