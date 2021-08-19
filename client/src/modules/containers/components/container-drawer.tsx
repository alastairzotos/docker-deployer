import * as React from 'react';
import SplitPane from 'react-split-pane';
import { Drawer } from 'antd';
import { useContainersState } from '../state';
import { Logs } from './logs';
import { Stats } from './stats';
import { headerHeight, statusBarHeight } from '../../common/components/app-main';

export const ContainerDrawer: React.FC = () => {
  const containers = useContainersState(state => state.containers);
  const selectedId = useContainersState(state => state.selectedId);
  const selectContainer = useContainersState(state => state.selectContainer);

  const selectedContainer = !!selectedId ? containers[selectedId] : null;

  return (
    <Drawer
      title={selectedContainer ? selectedContainer.name : ''}
      visible={!!selectedContainer}
      placement="bottom"
      closable={true}
      onClose={() => selectContainer(null)}
      height="370px"
      style={{ bottom: statusBarHeight }}
      bodyStyle={{ padding: 0 }}
      mask={false}
      zIndex={1000}
    >
      {!!selectedContainer && !!selectedId && (
        <SplitPane
          split="vertical"
          minSize={300}
          style={{ height: `calc(100% - ${headerHeight - 8}px)` }}
          defaultSize={parseInt(localStorage.getItem('container-split-pos')!, 10) || '60%'}
          onChange={split => localStorage.setItem('container-split-pos', String(split))}
        >
          <Stats id={selectedId} />
          <Logs id={selectedId} />
        </SplitPane>
      )}
    </Drawer>
  )
};
