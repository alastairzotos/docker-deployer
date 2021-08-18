import create from 'zustand';
import { CallStatus, ContainerStatuses } from '../../common/models';
import { httpClient } from '../../http/client';
import { ContainerStats } from '../models';

export interface ContainersStateValues {
  containers: ContainerStatuses;
  selectedId: string | null;

  containerStatsFetchStatus: CallStatus | null;
  selectedContainerStats: ContainerStats | null;
}

export interface ContainersStateActions {
  setContainers: (containers: ContainerStatuses) => void;
  selectContainer: (id: string | null) => void;
  setSelectedContainerStats: (stats: ContainerStats | null) => void;
  getContainerStats: () => Promise<void>;
}

export type ContainersState = ContainersStateValues & ContainersStateActions;

const initialState: ContainersStateValues = {
  containers: {},
  selectedId: null,
  selectedContainerStats: null,
  containerStatsFetchStatus: null
};

export const useContainersState = create<ContainersState>((set, get) => ({
  ...initialState,

  setContainers: containers => set({ containers }),

  selectContainer: id => set({ selectedId: id }),

  setSelectedContainerStats: stats => set({ selectedContainerStats: stats }),

  getContainerStats: async () => {
    const selectedId = get().selectedId;

    if (!!selectedId) {
      try {
        set({ containerStatsFetchStatus: 'fetching' });
        const stats = await httpClient.getContainerStats(selectedId);

        set({ selectedContainerStats: stats, containerStatsFetchStatus: 'success' });
      } catch {
        set({ containerStatsFetchStatus: 'error' });
      }
    } else {
      set({ selectedContainerStats: null });
    }
  }
}));
