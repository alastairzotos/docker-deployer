import { Card } from 'antd';
import * as React from 'react';
import { statusBarHeight } from '../../common/components/app-main';
import { ConnectionStatus } from './connection-status';

export const StatusBar: React.FC = () => {
  return (
    <Card
      style={{ width: '100%', height: statusBarHeight }}
      bodyStyle={{ padding: '2px 0 2px 6px' }}
    >
      <ConnectionStatus />
    </Card>
  )
};
