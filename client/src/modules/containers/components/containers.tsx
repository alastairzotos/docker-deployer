import * as React from 'react';
import { Button, Card, Table } from 'antd';
import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import styles from './containers.module.css';
import { useContainersState } from '../state';
import { ContainerStatus } from '../../common/models';
import { ContainerConnectionStatus } from './container-connection-status';
import { capitalise } from '../../common/utils';

export const Containers: React.FC = () => {
  const containers = useContainersState(state => state.containers);
  const selectContainer = useContainersState(state => state.selectContainer);

  return (
    <Card
      title="Containers"
      className={styles.containers}
      bodyStyle={{ padding: 0, height: 'calc(100% - 90px)' }}
      extra={
        <Button type="default" size="small">
          <PlusOutlined /> Deployment
        </Button>
      }
    >
      <Table
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: ContainerStatus) => (
              <a onClick={() => selectContainer(record.id)}>{name}</a>
            )
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record: ContainerStatus) => <ContainerConnectionStatus containerStatus={record} />
          },
          {
            title: 'Started',
            dataIndex: 'startedAt',
            key: 'startedAt',
            render: (started: string) => capitalise(started)
          },
          {
            title: 'Process ID',
            dataIndex: 'pid',
            key: 'pid',
            render: (pid: number) => pid > 0 ? pid : 'n/a'
          },
          {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            render: (port: number) => port > 0 ? port : 'n/a'
          },
          {
            title: 'View',
            dataIndex: 'port',
            key: 'x',
            render: (port: number) => (
              port > 0
                ? (
                  <a target="_blank" href={`${window.location.protocol}//${window.location.hostname}:${port}`}>
                    View&nbsp;
                    <SelectOutlined rotate={90} />
                  </a>
                )
                : null
            )
          }
        ]}

        dataSource={Object.keys(containers).map(id => ({ key: id, ...containers[id] }))}
      />
    </Card>
  )
};
