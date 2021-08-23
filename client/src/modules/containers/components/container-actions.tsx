import * as React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined, SelectOutlined } from '@ant-design/icons';
import { ContainerStatus } from "../../common/models";
import { httpClient } from '../../http/client';


interface Props {
  container: ContainerStatus;
}

export const ContainerActions: React.FC<Props> = ({ container: { id, status, port } }) => {
  const handleStopStart = () => {
    if (status === 'running') {
      httpClient.stopContainer(id);
    } else {
      httpClient.startContainer(id);
    }
  };

  const handleRestart = () => {
    httpClient.restartContainer(id);
  }

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <a onClick={handleStopStart}>
              {
                status === 'running'
                  ? 'Stop'
                  : 'Start'
              }
            </a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={handleRestart}>Restart</a>
          </Menu.Item>
          {port > 0 && (
            <Menu.Item>
              <a target="_blank" href={`${window.location.protocol}//${window.location.hostname}:${port}`}>
                View&nbsp;
                <SelectOutlined rotate={90} />
              </a>
            </Menu.Item>
          )}
        </Menu>
      }
      placement="bottomLeft"
      trigger={['click']}
      arrow
    >
      <Button>Actions <DownOutlined /></Button>
    </Dropdown>
  );
};
