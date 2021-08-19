import * as React from 'react';
import { LogsContainer } from '../../atomic/logs/logs-container';
import { useOutputState } from '../state';
import { OutputItem } from './item';

export const Output: React.FC = () => {
  const outputs = useOutputState(state => state.outputs);

  return (
    <LogsContainer title="Output">
    {
      outputs.map((output, index) => (
        <OutputItem key={index} output={output} />
      ))
    }
    </LogsContainer>
  )
};
