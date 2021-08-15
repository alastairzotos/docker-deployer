import * as React from 'react';
import { Layout, Space } from 'antd';

const { Content } = Layout;

export const headerHeight = 64;
export const statusBarHeight = 32;

export const AppMain: React.FC = ({ children }) => {
  return (
    <Content style={{ height: `calc(100vh - ${headerHeight + statusBarHeight}px)` }}>
      {children}
    </Content>
  )
};

