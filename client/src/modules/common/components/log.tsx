import { Typography, Progress } from 'antd';
import * as React from 'react';
import { Log } from '../../common/models';
import { formatTime } from '../../common/utils';

interface Props {
  log: Log;
}

const { Text } = Typography;

export const LogItem: React.FC<Props> = ({ log }) => {
  if (log.progress) {
    return (
      <div style={{ width: '60%' }}>
        <samp style={{ paddingRight: 10 }}>{log.progress.type}</samp>
        <Progress percent={Math.round((log.progress.current / log.progress.total) * 100)} size="small" />
        <br />
      </div>
    );
  }

  return (
    <span>
      <samp>[<Text type="secondary">{formatTime(log.date!)}</Text>] </samp>
      <samp><strong>{log.container}</strong>: </samp>
      <span><Text code>{log.message}</Text></span>
      <br />
    </span>
  )
}
