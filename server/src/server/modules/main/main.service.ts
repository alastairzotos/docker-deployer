import TimeAgo from 'javascript-time-ago';
import * as en from 'javascript-time-ago/locale/en'
import { ContainerStatuses, DeploymentInfo } from '../../models';
import { MessagingService } from '../messaging/messaging.service';
import { DockerService } from '../docker/docker.service';
import { LogService } from '../log/log.service';

export class MainService {
  private readonly timeAgo: TimeAgo;

  constructor(
    private readonly dockerService: DockerService,
    private readonly messagingService: MessagingService,
    private readonly logService: LogService
  ) {
    TimeAgo.addDefaultLocale(en);
    this.timeAgo = new TimeAgo('es-US');
  }

  handleDeploy = async ({ image, name, ports, tag }: DeploymentInfo) => {
    try {
      this.logService.log(name, 'Pulling image...');
      await this.dockerService.pullImage(name, image, tag);

      const containers = await this.dockerService.listContainers();
      const existingContainer = containers
        .find(container => container.data['Names'][0] === name || container.data['Names'][0] === '/' + name);

      if (!!existingContainer) {
        this.logService.log(name, 'Removing existing container...');
        await existingContainer.stop();
        await this.broadcastStatus();
        await existingContainer.delete();
        await this.broadcastStatus();
      }

      const [outPort, inPort] = ports.split(':');

      this.logService.log(name, 'Starting new container...');
      const container = await this.dockerService.createContainer(name, image, tag, inPort, outPort);

      await this.broadcastStatus();
      await container.start();
      await this.broadcastStatus();

      this.logService.log(name, 'Success');
    } catch (e) {
      this.logService.log(name, String(e));
    }

    return this.logService.flush();
  }

  broadcastStatus = async () => {
    const containers = await await this.dockerService.listContainers(true);

    const mappedContainers = await Promise.all(
      containers.map(container => this.dockerService.toContainerStatus(container, this.timeAgo))
    );

    const containerStatus = mappedContainers
      .reduce((acc, container) => ({
        ...acc,
        [container.id]: container
      }), {} as ContainerStatuses);

    this.messagingService.sendMessage({
      type: 'containers',
      containerStatus
    });
  }

  broadcastStatusContinuously = () => {
    setInterval(() => {
      this.broadcastStatus();
    }, 5000);
  };

}
