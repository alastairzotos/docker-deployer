import * as React from 'react';
import { Button, Dropdown, Menu, Typography, Modal } from 'antd';
import { DownOutlined, SelectOutlined } from '@ant-design/icons';
import { ContainerStatus } from "../../common/models";
import { httpClient } from '../../http/client';

const { Text } = Typography;

interface Props {
  container: ContainerStatus;
}

export const ContainerActions: React.FC<Props> = ({ container: { id, status, port } }) => {
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  const handleStopStartClick = () => {
    if (status === 'running') {
      httpClient.stopContainer(id);
    } else {
      httpClient.startContainer(id);
    }
  };

  const handleRestartClick = () => {
    httpClient.restartContainer(id);
  }

  const handleDeleteClick = () => setDeleteModalVisible(true);

  const handleDelete = () => {
    httpClient.deleteContainer(id);
    setDeleteModalVisible(false);
  }

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>
              <a onClick={handleStopStartClick}>
                {
                  status === 'running'
                    ? 'Stop'
                    : 'Start'
                }
              </a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={handleRestartClick}>Restart</a>
            </Menu.Item>
            {port > 0 && (
              <Menu.Item>
                <a target="_blank" href={`${window.location.protocol}//${window.location.hostname}:${port}`}>
                  View&nbsp;
                  <SelectOutlined rotate={90} />
                </a>
              </Menu.Item>
            )}
            <Menu.Item>
              <a onClick={handleDeleteClick}><Text type="danger">Delete</Text></a>
            </Menu.Item>
          </Menu>
        }
        placement="bottomLeft"
        trigger={['click']}
        arrow
      >
        <Button>Actions <DownOutlined /></Button>
      </Dropdown>

      <Modal
        title="Delete container?"
        visible={deleteModalVisible}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
      >
        <Text>Are you sure you want to delete the container?</Text>
      </Modal>
    </>
  );
};
