import { Col, Progress, Row, Statistic, Typography } from 'antd';
import * as React from 'react';
import { ConnectionStatus } from '../../atomic/connection-status/connection-status';
import { capitalise } from '../../common/utils';
import { httpClient } from '../../http/client';
import { useContainersState } from '../state';

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

  if (!selectedContainer) {
    return null;
  }

  return (
    <>
      {!!stats && (
        <div style={{ padding: 24 }}>
          <Row>
            <Col span={8}>
              <Statistic
                title="Status"
                value={capitalise(selectedContainer.status)}
                prefix={<ConnectionStatus connected={selectedContainer.status === 'running'} />}
              />
            </Col>
            <Col span={8}>
              <Statistic title="Memory" value={stats?.memUsage} />
            </Col>
            <Col span={8}>
              <ProgressWithTitle title="Memory" percent={stats?.memPerc!} />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Statistic title="Started" value={capitalise(selectedContainer.startedAt)} />
            </Col>
            <Col span={8}>
              <Statistic title="Network I/O" value={stats?.netIOUsage} />
            </Col>
            <Col span={8}>
              <ProgressWithTitle title="CPU" percent={stats?.cpuPerc!} />
            </Col>
          </Row>
        </div>
      )}
    </>
  )
};
