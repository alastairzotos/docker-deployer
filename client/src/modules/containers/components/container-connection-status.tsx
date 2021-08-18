import * as React from 'react';
import { ConnectionStatus } from '../../atomic/connection-status/connection-status';
import { ContainerStatus } from '../../common/models';
import { capitalise } from '../../common/utils';

interface Props {
  containerStatus: ContainerStatus;
}

export const ContainerConnectionStatus: React.FC<Props> = ({ containerStatus: { status } }) => (
  <ConnectionStatus
    connected={status === 'running'}
    text={capitalise(status)}
  />
);
