export type WsMessageType = 'log';

export interface Log {
  message: string;
  container: string;
  date: Date;
}

export interface WsMessage {
  type: WsMessageType;
  log?: Log;
}
