import { Typography } from 'antd';
import * as React from 'react';
import { Log } from '../../common/models';
import { formatTime } from '../../common/utils';

interface Props {
  log: Log;
}

const { Text } = Typography;

export const LogItem: React.FC<Props> = ({ log }) => {
  return (
    <span>
      <samp>[<Text type="secondary">{formatTime(log.date)}</Text>] </samp>
      <samp><strong>{log.container}</strong>: </samp>
      <span><Text code>{log.message}</Text></span>
      <br />
    </span>
  )
}
