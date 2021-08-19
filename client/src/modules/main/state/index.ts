import create from 'zustand';
import { ConnectionState, WsMessage } from '../../common/models';
import { useContainersState } from '../../containers/state';
import { useOutputState } from '../../output/state';

export interface AppStateValues {
  connectionState: ConnectionState | null;
  ws: WebSocket | null;
}

export interface AppStateActions {
  connectToWss: () => void;
}

export type AppState = AppStateValues & AppStateActions;

const initialState: AppStateValues = {
  connectionState: null,
  ws: null
};

export const useAppState = create<AppState>((set, get) => ({
  ...initialState,

  connectToWss: () => {
    const addLog = useOutputState.getState().addOutput;
    const setContainers = useContainersState.getState().setContainers;

    const ws = new WebSocket(`ws://${window.location.hostname}:4043`);
    set({ connectionState: 'connecting', ws });

    ws.onopen = () => set({ connectionState: 'connected' });
    
    ws.onclose = () => {
      set({ connectionState: 'disconnected' });

      setTimeout(get().connectToWss, 1000);
    }

    ws.onmessage = evt => {
      const data = JSON.parse(evt.data) as WsMessage;

      switch (data.type) {
        case 'output':
          addLog(data.output!);
          break;

        case 'containers':
          setContainers(data.containerStatus!);
          break;
      }
    }
  }
}));
