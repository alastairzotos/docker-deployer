import { Layout, Space, Typography } from 'antd';
import React from 'react';

const { Header } = Layout;
const { Title } = Typography;

export const AppTemplate: React.FC = ({ children }) => {
  return (
    <>
      <Header>
        <Space direction="horizontal" size="large">
          <img
            src="/bitmetro-logo.png"
            style={{ width: 50, height: 50 }}
            alt="BitMetro Logo"
          />

          <Title level={3} style={{ paddingTop: 16 }}>Container Manager</Title>
        </Space>
      </Header>

      <Layout>
        {children}
      </Layout>
    </>
  )
};
