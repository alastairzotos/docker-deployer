import * as React from 'react';
import { LogItem } from './log';
import { Log } from '../../common/models';
import { LogsContainer } from './logs-container';

interface Props {
  title?: string;
  logs: Log[];
}

export const LogsView: React.FC<Props> = ({ title = "Logs", logs }) => (
  <LogsContainer title={title}>
    {
      logs.map((log, index) => (
        <LogItem key={index} log={log} />
      ))
    }
  </LogsContainer>
);
