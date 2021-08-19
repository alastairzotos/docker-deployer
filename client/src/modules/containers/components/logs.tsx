import { Typography } from 'antd';
import * as React from 'react';
import { LogsContainer } from '../../atomic/logs/logs-container';
import { useContainersState } from '../state';

const { Text } = Typography;

export const Logs: React.FC = () => {
  const selectedId = useContainersState(state => state.selectedId);

  const logsFetchStatus = useContainersState(state => state.containerLogsFetchStatus);
  const logs = useContainersState(state => state.selectedContainerLogs);
  const getLogs = useContainersState(state => state.getContainerLogs);

  React.useEffect(() => {
    getLogs();
  }, [selectedId, getLogs]);

  return (
    <LogsContainer>
      {logsFetchStatus === 'fetching' && (
        <Text type="secondary">Fetching...</Text>
      )}

      {logsFetchStatus === 'error' && (
        <Text type="danger">There was an error fetching the logs</Text>
      )}

      {logsFetchStatus === 'success' && !!logs && (
        logs.map((log, index) => (
          <React.Fragment key={index}>
            <Text type="success" key={index}>{log}</Text>
            <br />
          </React.Fragment>
        ))
      )}
    </LogsContainer>
  )
};
