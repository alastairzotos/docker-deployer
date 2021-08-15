import create from 'zustand';
import { Log, WsMessage } from '../../common/models';
import { ConnectionState } from '../models';

export interface AppStateValues {
  connectionState: ConnectionState | null;
  ws: WebSocket | null;
  logs: Log[];
}

export interface AppStateActions {
  connectToWss: () => void;
}

export type AppState = AppStateValues & AppStateActions;

const initialState: AppStateValues = {
  connectionState: null,
  ws: null,
  logs: []
};

export const useAppState = create<AppState>((set, get) => ({
  ...initialState,

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
          set({ logs: [...get().logs, { ...data.log!, date: new Date(data.log?.date as any as string) } ]});
          break;

      }
    }
  }
}));
