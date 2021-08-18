import * as React from 'react';
import SplitPane from 'react-split-pane';
import { AppMain, headerHeight } from '../../../modules/common/components/app-main';
import { AppTemplate } from '../../../modules/common/components/app-template';
import { Containers } from '../../../modules/main/components/containers';
import { Output } from './output';
import { StatusBar } from '../../../modules/main/components/status-bar';
import { useAppState } from '../state';
import { Login } from './login';

export const Main: React.FC = () => {
  const authToken = useAppState(state => state.authToken);
  const connectToWs = useAppState(state => state.connectToWss);

  React.useEffect(() => {
    connectToWs();
  }, [connectToWs]);
  
  return (
    <AppTemplate>
      <AppMain>

        {!authToken && (
          <Login />
        )}

        {!!authToken && (
          <SplitPane
            split="vertical"
            minSize={300}
            style={{ height: `calc(100% - ${headerHeight}px)` }}
            defaultSize={parseInt(localStorage.getItem('split-pos')!, 10) || '60%'}
            onChange={split => localStorage.setItem('split-pos', String(split))}
          >
            <Containers />
            <Output />
          </SplitPane>
        )}

      </AppMain>
      <StatusBar />
    </AppTemplate>
  );
};
