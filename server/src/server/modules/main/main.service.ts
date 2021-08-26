import { ContainerStatuses, DeploymentInfo } from '../../models';
import { MessagingService } from '../messaging/messaging.service';
import { DockerService } from '../docker/docker.service';
import { LogService } from '../log/log.service';
import { Service } from 'typedi';

@Service()
export class MainService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly messagingService: MessagingService,
    private readonly logService: LogService
  ) { }

  handleDeploy = async (deploymentInfo: DeploymentInfo) => {
    const { image, name, tag } = deploymentInfo;

    try {
      this.logService.log(name, 'Pulling image...');
      await this.dockerService.pullImage(name, image, tag);

      const existingContainer = await this.dockerService.getContainerByName(name);

      if (!!existingContainer) {
        this.logService.log(name, 'Removing existing container...');
        await existingContainer.stop();
        await this.broadcastStatus();
        await existingContainer.delete();
        await this.broadcastStatus();
      }

      this.logService.log(name, 'Starting new container...');
      const container = await this.dockerService.createContainer(deploymentInfo);

      await this.broadcastStatus();
      await container.start();
      await this.broadcastStatus();

      this.logService.log(name, 'Success');
    } catch (e) {
      this.logService.log(name, String(e));
    }

    return this.logService.flush();
  }

  stopContainer = async (id: string) => {
    const container = await this.dockerService.getContainerById(id);
    await container.stop();
    await this.broadcastStatus();
  }

  startContainer = async (id: string) => {
    const container = await this.dockerService.getContainerById(id);
    await container.start();
    await this.broadcastStatus();
  }

  restartContainer = async (id: string) => {
    const container = await this.dockerService.getContainerById(id);
    await container.stop();
    await this.broadcastStatus();
    await container.start();
    await this.broadcastStatus();
  }

  deleteContainer = async (id: string) => {
    const container = await this.dockerService.getContainerById(id);
    await container.stop();
    await this.broadcastStatus();
    await container.delete();
    await this.broadcastStatus();
  }

  broadcastStatus = async () => {
    const containers = await await this.dockerService.listContainers(true);

    const mappedContainers = await Promise.all(containers.map(this.dockerService.toContainerStatus));

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

  broadcastStatusContinuously = () =>
    setInterval(() => {
      this.broadcastStatus();
    }, 5000);
}
