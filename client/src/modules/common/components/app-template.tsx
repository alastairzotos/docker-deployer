import { Layout, Space } from 'antd';
import React from 'react';

const { Header } = Layout;

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
        </Space>
      </Header>

      <Layout>
        {children}
      </Layout>
    </>
  )
};
