import * as React from 'react';
import { Button, Card, Table } from 'antd';
import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import styles from './containers.module.css';
import connectionStyles from './connection-status.module.css';
import { useAppState } from '../state';
import { formatDateTime } from '../../common/utils';

export const Containers: React.FC = () => {
  const containers = useAppState(state => state.containers);

  return (
    <Card
      title="Containers"
      className={styles.containers}
      bodyStyle={{
        padding: 0,
        height: '100%',
        // backgroundColor: 'black',
      }}
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
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (data: string) => (
              <>
                {data === 'running' && <span className={connectionStyles.online} />}
                {data[0].toUpperCase() + data.substr(1)}
              </>
            )
          },
          {
            title: 'Started',
            dataIndex: 'startedAt',
            key: 'startedAt',
          },
          {
            title: 'Process ID',
            dataIndex: 'pid',
            key: 'pid'
          },
          {
            title: 'Port',
            dataIndex: 'port',
            key: 'name'
          },
          {
            title: 'View',
            dataIndex: 'port',
            key: 'name',
            render: (port: number) => (
              <a target="_blank" href={`http://localhost:${port}`}>
                View&nbsp;
                <SelectOutlined rotate={90} />
              </a>
            )
          }
        ]}

        dataSource={Object.keys(containers).map(id => containers[id])}
      />
    </Card>
  )
};
