import { Service } from 'typedi';
import * as WebSocket from 'ws';
import * as http from 'http';
import { WsMessage } from '../../models';
import { CoreService } from '../../../core';
import { AppService } from '../app/app.service';

@Service()
export class MessagingService {
  private httpServer: http.Server;
  private wsServer: WebSocket.Server;

  constructor(
    private readonly coreService: CoreService,
    private readonly appService: AppService,
  ) {
    this.httpServer = http.createServer(this.appService.app);
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
  }

  listen = () =>
    this.httpServer.listen(
      this.coreService.wsPort,
      () => console.log(`Websocket server listening on ws://localhost:${this.coreService.wsPort}`)
    );

  sendMessage = (message: WsMessage) =>
    this.wsServer.clients.forEach(client => (
      client.send(JSON.stringify(message))
    ));
}
