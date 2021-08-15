import * as React from 'react';
import styles from './connection-status.module.css';
import { ConnectionState } from "../models";
import { useAppState } from '../state';

const getConnectionStatePrompt = (state: ConnectionState | null): string => {
  switch (state) {
    case 'connecting': return 'Connecting...';
    case 'connected': return 'Connected';
    case 'disconnected': return 'Disconnected. Retrying...';
  }

  return '';
}


export const ConnectionStatus: React.FC = () => {
  const connectionState = useAppState(state => state.connectionState);

  return (
    <samp>
      {connectionState === 'connected' && <span className={styles.online} />}
      {getConnectionStatePrompt(connectionState)}
    </samp>
  )
};
