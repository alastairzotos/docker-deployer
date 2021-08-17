export type WsMessageType = 'log' | 'containers';

export interface Progress {
  type: string;
  id: string;
  current: number;
  total: number;
}

export interface Log {
  container: string;
  message?: string;
  date?: Date;
  progress?: Progress;
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
  containerStatus?: ContainerStatuses;
}
