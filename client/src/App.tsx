import { Col, Row } from 'antd';
import * as React from 'react';
import { AppMain } from './modules/common/components/app-main';
import { AppTemplate } from './modules/common/components/app-template';
import { Logs } from './modules/main/components/logs';
import { StatusBar } from './modules/main/components/status-bar';

const App: React.FC = () => (
  <AppTemplate>
    <AppMain>
      <Row style={{ height: '100%' }}>
        <Col span={12} style={{ height: '100%' }}>
          <Logs />
        </Col>
      </Row>
    </AppMain>

    <StatusBar />
  </AppTemplate>
);

export default App;
