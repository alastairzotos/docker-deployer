import * as React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DeploymentInfo } from '../../common/models';
import { httpClient } from '../../http/client';

export const AddDeployment: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const onFinish = (values: DeploymentInfo) => {
   if (values.tag.trim() === '') {
     values.tag = 'latest';
   }

   httpClient.createDeployment(values);
   setModalOpen(false);
  };

  return (
    <>
      <Button type="default" size="small" onClick={() => setModalOpen(true)}>
        <PlusOutlined /> Deployment
      </Button>

      <Modal
        title="New Deployment"
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}

        footer={[
          <Button form="deployment" key="submit" htmlType="submit">
              Create deployment
          </Button>
        ]}
      >
        <Form
          name="deployment"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{
            image: '',
            name: '',
            ports: '80:8080',
            tag: 'latest'
          } as DeploymentInfo}
        >
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Enter an image name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Container name"
            name="name"
            rules={[{ required: true, message: 'Enter a container name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tag"
            name="tag"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ports"
            name="ports"
            rules={[{ required: true, message: 'Enter a port-forwarding pattern' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
