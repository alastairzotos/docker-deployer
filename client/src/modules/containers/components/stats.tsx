import { Progress, Statistic, Typography } from 'antd';
import * as React from 'react';
import { ConnectionStatus } from '../../atomic/connection-status/connection-status';
import { capitalise } from '../../common/utils';
import { httpClient } from '../../http/client';
import { useContainersState } from '../state';
import styles from './stats.module.css';

const { Title } = Typography;

const ProgressWithTitle: React.FC<{ title: string, percent: number }> = ({ title, percent }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Progress
      type="dashboard"
      style={{ alignSelf: 'center' }}
      width={60}
      percent={parseFloat(percent.toFixed(2))}
    />

    <Title level={4} style={{ textAlign: 'center' }}>{title}</Title>
  </div>
);

interface Props {
  id: string;
}

export const Stats: React.FC<Props> = ({ id }) => {
  const containers = useContainersState(state => state.containers);

  const stats = useContainersState(state => state.stats)[id];

  React.useEffect(() => {
    if (!stats) {
      httpClient.getContainerStats(id);
    }
  }, [stats]);

  const selectedContainer = containers[id];

  if (!selectedContainer || !stats) {
    return null;
  }

  return (
    <table className={styles.stats}>
      <tbody>
        <tr>
          <td>
            <Statistic
              title="Status"
              value={capitalise(selectedContainer.status)}
              prefix={<ConnectionStatus connected={selectedContainer.status === 'running'} />}
            />
          </td>
          <td>
            <Statistic title="Memory / Limit" value={stats?.memUsage} />
          </td>
          <td>
            <ProgressWithTitle title="Memory" percent={stats?.memPerc!} />
          </td>
        </tr>
        <tr>
          <td>
            <Statistic title="Started" value={capitalise(selectedContainer.startedAt)} />
          </td>
          <td>
            <Statistic title="Network I/O" value={stats?.netIOUsage} />
          </td>
          <td>
            <ProgressWithTitle title="CPU" percent={stats?.cpuPerc!} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
