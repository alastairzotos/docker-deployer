import create from 'zustand';
import { message } from 'antd';
import { ContainerStatuses, Log, WsMessage } from '../../common/models';
import { httpClient } from '../http/client';
import { CallStatus, ConnectionState } from '../models';

const authTokenKey = 'mctrl-auth-token';

export interface AppStateValues {
  connectionState: ConnectionState | null;
  ws: WebSocket | null;
  logs: Log[];
  containers: ContainerStatuses;
  authToken: string | null;
  loginStatus: CallStatus | null;
}

export interface AppStateActions {
  connectToWss: () => void;
  login: (password: string) => void;
}

export type AppState = AppStateValues & AppStateActions;

const initialState: AppStateValues = {
  connectionState: null,
  ws: null,
  logs: [],
  containers: {},
  authToken: localStorage.getItem(authTokenKey) || null,
  loginStatus: null
};

export const useAppState = create<AppState>((set, get) => ({
  ...initialState,

  login: async password => {
    set({ loginStatus: 'fetching' });

    try {
      const jwt = await httpClient.login(password);
      set({
        loginStatus: 'success',
        authToken: jwt!
      });

      localStorage.setItem(authTokenKey, jwt!);
      message.success('Access granted');
      await httpClient.triggerBroadcast();
    } catch (e) {
      set({ loginStatus: 'error' });
    }
  },

  connectToWss: () => {
    const ws = new WebSocket('ws://localhost:4043');
    set({
      connectionState: 'connecting',
      ws
    });

    ws.onopen = () => set({ connectionState: 'connected' });
    ws.onclose = () => {
      set({ connectionState: 'disconnected' });

      setTimeout(() => {
        get().connectToWss();
      }, 1000);
    }

    ws.onmessage = evt => {
      const data = JSON.parse(evt.data) as WsMessage;

      switch (data.type) {
        case 'log':
          if (data.log?.progress) {
            const foundLog = get().logs.find(log => log.progress && log.progress.id === data.log?.progress?.id);
            if (foundLog) {
              set({
                logs: get().logs.map(log => (
                  log.progress && log.progress.id === foundLog.progress?.id
                  ? data.log!
                  : log
                ))
              })
            } else {
              set({
                logs: [
                  ...get().logs,
                  data.log!
                ]
              })
            }
          } else {
            set({
              logs: [
                ...get().logs,
                {
                  ...data.log!,
                  date: new Date(data.log?.date as any as string)
                }
              ]
            });
          }
          break;

        case 'containers':
          set({ containers: data.containerStatus! });
          break;
      }
    }
  }
}));
