import { Card } from 'antd';
import * as React from 'react';
import styles from './logs.module.css';

interface Props {
  title?: string;
  bodyHeightOffset?: number;
}

export const LogsContainer: React.FC<Props> = ({
  title = "Logs",
  bodyHeightOffset = 0,
  children
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [children]);

  return (
    <Card
      title={title}
      className={styles.logs}
      bodyStyle={{
        backgroundColor: 'black',
        height: `calc(100% - ${90 - bodyHeightOffset}px)`,
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
       {children} 
      </div>
    </Card>
  )
};
