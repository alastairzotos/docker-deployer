import create from 'zustand';
import { Output } from '../../common/models';

export interface OutputStateValues {
  outputs: Output[];
}

export interface OutputStateActions {
  addOutput: (output: Output) => void;
  setProgress: (output: Output) => void;
}

export type OutputState = OutputStateValues & OutputStateActions;

const initialState: OutputStateValues = {
  outputs: []
};

export const useOutputState = create<OutputState>((set, get) => ({
  ...initialState,

  addOutput: output => {
    if (output?.progress) {
      get().setProgress(output);
    } else {
      set({
        outputs: [...get().outputs, { ...output!, date: new Date(output?.date as any as string) }]
      });
    }
  },

  setProgress: progressOutput => {
    const foundOutput = get().outputs.find(output => output.progress && output.progress.id === progressOutput?.progress?.id);
    if (foundOutput) {
      set({
        outputs: get().outputs.map(output => (
          output.progress && output.progress.id === foundOutput.progress?.id
          ? progressOutput!
          : output
        ))
      })
    } else {
      set({
        outputs: [...get().outputs, progressOutput!]
      });
    }
  }
}));
