import { Card } from 'antd';
import * as React from 'react';
import { statusBarHeight } from '../../common/components/app-main';
import { ConnectionState } from '../models';
import { useAppState } from '../state';
import { ConnectionStatus } from '../../common/components/connection-status';

const getConnectionStatePrompt = (state: ConnectionState | null): string => {
  switch (state) {
    case 'connecting': return 'Connecting...';
    case 'connected': return 'Connected';
    case 'disconnected': return 'Disconnected. Retrying...';
  }

  return '';
}

export const StatusBar: React.FC = () => {
  const connectionState = useAppState(state => state.connectionState);
  
  return (
    <Card
      style={{ width: '100%', height: statusBarHeight }}
      bodyStyle={{ padding: '2px 0 2px 6px' }}
    >
      <ConnectionStatus
        connected={connectionState === 'connected'}
        text={getConnectionStatePrompt(connectionState)}
      />
    </Card>
  )
};
