import create from 'zustand';
import { CallStatus, ContainerStatuses } from '../../common/models';
import { httpClient } from '../../http/client';
import { ContainerStats } from '../models';

export interface ContainersStateValues {
  containers: ContainerStatuses;
  selectedId: string | null;

  stats: { [id: string]: ContainerStats };  
  logs: { [id: string]: string[] };
}

export interface ContainersStateActions {
  setContainers: (containers: ContainerStatuses) => void;
  selectContainer: (id: string | null) => void;

  setContainerStats: (id: string, stats: ContainerStats | null) => void;
  addContainerLogs: (id: string, logs: string[]) => void;
}

export type ContainersState = ContainersStateValues & ContainersStateActions;

const initialState: ContainersStateValues = {
  containers: {},
  selectedId: null,

  stats: {},
  logs: {}
};

export const useContainersState = create<ContainersState>((set, get) => ({
  ...initialState,

  setContainers: containers => set({ containers }),

  selectContainer: id => set({ selectedId: id }),

  setContainerStats: (id, stats) => !!stats && set({
    stats: {
      ...get().stats,
      [id]: stats!
    }
  }),

  addContainerLogs: (id, logs) => set({
    logs: {
      ...get().logs,
      [id]: [
        ...(get().logs[id] || []),
        ...logs
      ]
    }
  }),
}));
