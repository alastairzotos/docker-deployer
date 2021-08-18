import * as React from 'react';
import { useAppState } from '../state';
import { LogsView } from '../../common/components/logs-view';

export const Output: React.FC = () => {
  const logs = useAppState(state => state.logs);

  return <LogsView title="Output" logs={logs} />;
};
