import * as React from 'react';
import { Drawer, Row, Col } from 'antd';
import { useContainersState } from '../state';
import { Logs } from './logs';
import { Stats } from './stats';

export const ContainerDrawer: React.FC = () => {
  const containers = useContainersState(state => state.containers);
  const selectedId = useContainersState(state => state.selectedId);
  const selectContainer = useContainersState(state => state.selectContainer);

  const selectedContainer = !!selectedId ? containers[selectedId] : null;

  const fullHeight: React.CSSProperties = { height: '100%' };

  return (
    <Drawer
      title={selectedContainer ? selectedContainer.name : ''}
      visible={!!selectedContainer}
      placement="bottom"
      closable={true}
      onClose={() => selectContainer(null)}
      height="350px"
      bodyStyle={{ padding: 0 }}
      mask={false}
      zIndex={1000}
    >
      {!!selectedContainer && (
        <>
          <Row style={fullHeight}>
            <Col span={14} style={fullHeight}>
              <Stats />
            </Col>

            <Col span={10} style={fullHeight}>
              <Logs />
            </Col>
          </Row>
        </>
      )}
    </Drawer>
  )
};
