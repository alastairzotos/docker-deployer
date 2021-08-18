import * as React from 'react';
import {
  Drawer,
  Typography,
  Statistic,
  Row,
  Col,
  Progress,
  Spin,
} from 'antd';
import { useContainersState } from '../state';
import { ConnectionStatus } from '../../atomic/connection-status/connection-status';
import { capitalise } from '../../common/utils';
import { LogsContainer } from '../../atomic/logs/logs-container';

const { Title, Text } = Typography;

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


export const ContainerDrawer: React.FC = () => {
  const containers = useContainersState(state => state.containers);
  const selectedId = useContainersState(state => state.selectedId);
  const selectContainer = useContainersState(state => state.selectContainer);

  const statsFetchStatus = useContainersState(state => state.containerStatsFetchStatus);
  const stats = useContainersState(state => state.selectedContainerStats);
  const getStats = useContainersState(state => state.getContainerStats);

  const logsFetchStatus = useContainersState(state => state.containerLogsFetchStatus);
  const logs = useContainersState(state => state.selectedContainerLogs);
  const getLogs = useContainersState(state => state.getContainerLogs);

  const selectedContainer = !!selectedId ? containers[selectedId] : null;

  React.useEffect(() => {
    getStats();
    getLogs();
  }, [selectedId]);

  const fullHeight: React.CSSProperties = { height: '100%' };

  return (
    <Drawer
      title={selectedContainer ? selectedContainer.name : ''}
      visible={!!selectedContainer}
      placement="bottom"
      closable={true}
      onClose={() => selectContainer(null)}
      height="350px"
      bodyStyle={{ padding: 0 }}
      mask={false}
      zIndex={1000}
    >
      {!!selectedContainer && (
        <>
          <Row style={fullHeight}>
            <Col span={14}>
              {statsFetchStatus === 'fetching' && (
                <div
                  style={{
                    textAlign: 'center',
                    paddingTop: 50
                  }}
                >
                  <Spin />
                </div>
              )}

              {statsFetchStatus === 'error' && (
                <Text type="danger">There was a problem getting container stats</Text>
              )}

              {statsFetchStatus === 'success' && !!stats && (

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
            </Col>

            <Col span={10} style={{ height: '100%' }}>
              <LogsContainer>
                {logsFetchStatus === 'fetching' && (
                  <Text type="secondary">Fetching...</Text>
                )}

                {logsFetchStatus === 'error' && (
                  <Text type="danger">There was an error fetching the logs</Text>
                )}

                {logsFetchStatus === 'success' && !!logs && (
                  logs.map((log, index) => (
                    <React.Fragment key={index}>
                      <Text type="success" key={index}>{log}</Text>
                      <br />
                    </React.Fragment>
                  ))
                )}
              </LogsContainer>
            </Col>
          </Row>
        </>
      )}
    </Drawer>
  )
};
