import create from 'zustand';
import { Log } from '../../common/models';

export interface OutputStateValues {
  logs: Log[];
}

export interface OutputStateActions {
  addLog: (log: Log) => void;
  setProgress: (log: Log) => void;
}

export type OutputState = OutputStateValues & OutputStateActions;

const initialState: OutputStateValues = {
  logs: []
};

export const useOutputState = create<OutputState>((set, get) => ({
  ...initialState,

  addLog: log => {
    if (log?.progress) {
      get().setProgress(log);
    } else {
      set({
        logs: [...get().logs, { ...log!, date: new Date(log?.date as any as string) }]
      });
    }
  },

  setProgress: progressLog => {
    const foundLog = get().logs.find(log => log.progress && log.progress.id === progressLog?.progress?.id);
    if (foundLog) {
      set({
        logs: get().logs.map(log => (
          log.progress && log.progress.id === foundLog.progress?.id
          ? progressLog!
          : log
        ))
      })
    } else {
      set({
        logs: [...get().logs, progressLog!]
      });
    }
  }
}));
