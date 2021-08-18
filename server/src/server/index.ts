import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import Container from 'typedi';
import { MainService } from './modules/main/main.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { MainController } from './modules/main/main.controller';
import { MessagingService } from './modules/messaging/messaging.service';
import { CoreService } from 'src/core';

export const startServer = async () => {  
  const app = express();
  app.use(express.json());
  app.use(cors());

  const port = Container.get<CoreService>(CoreService).httpPort;
  const wsPort = Container.get<CoreService>(CoreService).wsPort;

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

  messagingService.listen(wsPort);
  app.listen(port, () => console.log(`App server listening on http://localhost:${port}`));
};

startServer();
