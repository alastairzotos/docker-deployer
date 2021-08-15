export type WsMessageType = 'log' | 'containers';

export interface Log {
  message: string;
  container: string;
  date: Date;
}

export interface ContainerStatus {
  id: string;
  name: string;
  status: string;
  pid: number;
  port: number;
  startedAt: string;
}

export type ContainerStatuses = { [id: string]: ContainerStatus };

export interface WsMessage {
  type: WsMessageType;
  log?: Log;
  containerStatus?: ContainerStatuses
}
