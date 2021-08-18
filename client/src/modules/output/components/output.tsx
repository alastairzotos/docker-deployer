import * as React from 'react';
import { LogsView } from '../../atomic/logs/logs-view';
import { useOutputState } from '../state';

export const Output: React.FC = () => {
  const logs = useOutputState(state => state.logs);

  return <LogsView title="Output" logs={logs} />;
};
