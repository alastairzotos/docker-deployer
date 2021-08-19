export type WsMessageType = 'output' | 'containers' | 'logs';

export interface Progress {
  type: string;
  id: string;
  current: number;
  total: number;
}

export interface Output {
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

export interface ContainerLogs {
  id: string;
  logs: string[];
}

export interface WsMessage {
  type: WsMessageType;
  output?: Output;
  containerStatus?: ContainerStatuses;
  containerLogs?: ContainerLogs;
}
