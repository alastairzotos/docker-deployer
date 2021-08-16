import { Card } from 'antd';
import * as React from 'react';
import styles from './logs.module.css';
import { useAppState } from '../state';
import { LogItem } from './log';

export const Logs: React.FC = () => {
  const logs = useAppState(state => state.logs);
  const connectToWs = useAppState(state => state.connectToWss);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    connectToWs();
  }, [connectToWs]);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [logs.length])

  return (
    <Card
      title="Logs"
      className={styles.logs}
      bodyStyle={{
        backgroundColor: 'black',
        height: 'calc(100% - 47px)',
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
