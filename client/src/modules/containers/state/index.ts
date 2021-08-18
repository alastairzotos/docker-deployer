import create from 'zustand';
import { ContainerStatuses } from '../../common/models';

export interface ContainersStateValues {
  containers: ContainerStatuses;
}

export interface ContainersStateActions {
  setContainers: (containers: ContainerStatuses) => void;
}

export type ContainersState = ContainersStateValues & ContainersStateActions;

const initialState: ContainersStateValues = {
  containers: {}
};

export const useContainersState = create<ContainersState>(set => ({
  ...initialState,

  setContainers: containers => set({ containers })
}));
