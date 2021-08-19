import { Typography } from 'antd';
import * as React from 'react';
import { LogsContainer } from '../../atomic/logs/logs-container';
import { httpClient } from '../../http/client';
import { useContainersState } from '../state';

const { Text } = Typography;

interface Props {
  id: string;
}

export const Logs: React.FC<Props> = ({ id }) => {
  const logs = useContainersState(state => state.logs)[id];

  React.useEffect(() => {
    if (!logs) {
      httpClient.getContainerLogs(id);
    }
  }, [logs]);

  return (
    <LogsContainer>
      {!!logs && logs.map((log, index) => (
        <React.Fragment key={index}>
          <Text type="success" key={index}>{log}</Text>
          <br />
        </React.Fragment>
      ))}
    </LogsContainer>
  )
};
