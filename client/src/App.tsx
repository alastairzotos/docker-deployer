import * as React from 'react';
import { AppMain } from './modules/common/components/app-main';
import { AppTemplate } from './modules/common/components/app-template';
import { Containers } from './modules/main/components/containers';
import { Logs } from './modules/main/components/logs';
import { StatusBar } from './modules/main/components/status-bar';
import SplitPane from 'react-split-pane';

const App: React.FC = () => (
  <AppTemplate>
    <AppMain>
      <SplitPane
        split="vertical"
        minSize={300}
        defaultSize={parseInt(localStorage.getItem('split-pos')!, 10) || '60%'}
        onChange={split => localStorage.setItem('split-pos', String(split))}
      >
        <Containers />
        <Logs />
      </SplitPane>
    </AppMain>

    <StatusBar />
  </AppTemplate>
);

export default App;
