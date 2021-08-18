import { Service } from 'typedi';
import * as WebSocket from 'ws';
import * as http from 'http';
import { WsMessage } from '../../models';

@Service()
export class MessagingService {
  httpServer: http.Server;
  private wsServer: WebSocket.Server;

  constructor() {}

  setup = (app: http.RequestListener) => {
    this.httpServer = http.createServer(app);
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
  }

  sendMessage = (message: WsMessage) =>
    this.wsServer.clients.forEach(client => (
      client.send(JSON.stringify(message))
    ));
}
