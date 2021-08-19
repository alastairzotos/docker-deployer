import { Typography, Progress } from 'antd';
import * as React from 'react';
import { Output } from '../../common/models';
import { formatTime } from '../../common/utils';

interface Props {
  output: Output;
}

const { Text } = Typography;

export const OutputItem: React.FC<Props> = ({ output }) => {
  if (output.progress) {
    return (
      <div style={{ width: '60%' }}>
        <samp style={{ paddingRight: 10 }}>{output.progress.type}</samp>
        <Progress percent={Math.round((output.progress.current / output.progress.total) * 100)} size="small" />
        <br />
      </div>
    );
  }

  return (
    <span>
      <samp>[<Text type="secondary">{formatTime(output.date!)}</Text>] </samp>
      <samp><strong>{output.container}</strong>: </samp>
      <span><Text code>{output.message}</Text></span>
      <br />
    </span>
  )
}
