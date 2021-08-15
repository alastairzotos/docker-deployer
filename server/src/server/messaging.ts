import * as WebSocket from 'ws';
import { WsMessage } from "./models";

export const sendMessage = (wss: WebSocket.Server, message: WsMessage) =>
  wss.clients.forEach(client => (
    client.send(JSON.stringify(message))
  ));
