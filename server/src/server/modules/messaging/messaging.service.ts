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

  listen = (port: number) =>
    this.httpServer.listen(port, () => console.log(`Websocket server listening on ws://localhost:${port}`));

  sendMessage = (message: WsMessage) =>
    this.wsServer.clients.forEach(client => (
      client.send(JSON.stringify(message))
    ));
}
