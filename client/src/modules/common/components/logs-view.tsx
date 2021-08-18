import { Card } from 'antd';
import * as React from 'react';
import styles from './logs.module.css';
import { LogItem } from './log';
import { Log } from '../models';

interface Props {
  title?: string;
  logs: Log[];
}

export const LogsView: React.FC<Props> = ({
  title = "Logs",
  logs
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [logs.length])

  return (
    <Card
      title={title}
      className={styles.logs}
      bodyStyle={{
        backgroundColor: 'black',
        height: 'calc(100% - 90px)',
        width: '100%',
        padding: 0,
      }}
    >
      <div
        style={{
          height: '100%',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflowX: 'scroll',
          overflowY: 'scroll'
        }}

        ref={ref}
      >
      {
        logs.map((log, index) => (
          <LogItem key={index} log={log} />
        ))
      }
      </div>
    </Card>
  )
};
