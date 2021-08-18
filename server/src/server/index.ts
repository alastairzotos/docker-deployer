import 'reflect-metadata';
import Container from 'typedi';
import { MainService } from './modules/main/main.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { MainController } from './modules/main/main.controller';
import { MessagingService } from './modules/messaging/messaging.service';
import { AppService } from './modules/app/app.service';

export const startServer = async () => {  
  const appService = Container.get<AppService>(AppService);
  const messagingService = Container.get<MessagingService>(MessagingService);

  const mainService = Container.get<MainService>(MainService);
  const authController = Container.get<AuthController>(AuthController);
  const authMiddleware = Container.get<AuthMiddleware>(AuthMiddleware);
  const mainController = Container.get<MainController>(MainController);
  
  mainService.broadcastStatusContinuously();

  appService.app.post('/login', authController.login);
  appService.app.post('/deploy', authMiddleware.authenticate, mainController.deploy);
  appService.app.post('/trigger-broadcast', authMiddleware.authenticate, mainController.triggerBroadcast);
  appService.app.get('/get-stats', authMiddleware.authenticate, mainController.getContainerStats);

  messagingService.listen();
  appService.listen();
};

startServer();
