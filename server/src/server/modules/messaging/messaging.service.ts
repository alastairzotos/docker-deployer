import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';
import { WsMessage } from '../../models';

@Injectable()
export class MessagingService {
  constructor(private readonly wss: WebSocket.Server) { }

  sendMessage = (message: WsMessage) =>
    this.wss.clients.forEach(client => (
      client.send(JSON.stringify(message))
    ));
}
