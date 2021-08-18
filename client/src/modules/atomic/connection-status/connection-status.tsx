import * as React from 'react';
import styles from './connection-status.module.css';

interface Props {
  connected: boolean;
  text?: string;
}

export const ConnectionStatus: React.FC<Props> = ({ connected, text }) => (
  <span>
    {connected ? <span className={styles.online} /> : <span className={styles.offline} />}
    {text && <span>{text}</span>}
  </span>
);
