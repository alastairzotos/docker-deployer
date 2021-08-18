import { Stream } from 'stream';
import { Docker } from 'node-docker-api';
import { MessagingService } from '../messaging/messaging.service';
import { Container } from 'node-docker-api/lib/container';
import { ContainerStatus, DeploymentInfo } from '../../models';
import TimeAgo from 'javascript-time-ago';
import { LogService } from '../log/log.service';
import { Service } from 'typedi';
import { TimeService } from '../time/time.service';

@Service()
export class DockerService {
  private readonly docker: Docker;

  constructor(
    private messagingService: MessagingService,
    private logService: LogService,
    private timeService: TimeService,
  ) {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  pullImage = async (containerName: string, image: string, tag: string) =>
    await this.docker.image.create({}, { fromImage: image, tag })
      .then(stream => this.promisifyStream(stream as any as Stream, containerName));

  listContainers = async (all = false) =>
    await this.docker.container.list({ all });

  createContainer = async ({ name, image, tag, ports }: DeploymentInfo) => {
    const [outPort, inPort] = ports.split(':');

    return await this.docker.container.create({
      Image: image + ':' + tag,
      name,
      PortBindings: {
        [`${inPort}/tcp`]: [{ HostPort: String(outPort) }]
      },
      ExposedPorts: {
        [`${inPort}/tcp`]: {}
      }
    });
  }

  getContainerByName = async (name: string): Promise<Container> => {
    const containers = await this.listContainers();
    return containers.find(container => container.data['Names'][0] === name || container.data['Names'][0] === '/' + name);
  }


  toContainerStatus = async (container: Container): Promise<ContainerStatus> => {
    const status = await container.status();

    return {
      id: container.id,
      name: status.data['Name'].substr(1),
      pid: status.data['State'].Pid,
      port: container.data['Ports'].length ? container.data['Ports'][0]['PublicPort'] : -1,
      status: status.data['State'].Status,
      startedAt: this.timeService.format(new Date(status.data['State'].StartedAt))
    }
  }

  private promisifyStream = (stream: Stream, container: string) =>
    new Promise((resolve, reject) => {
      stream.on('data', (data: Buffer) => {
        const strData = data.toString();

        // Docker api sometimes returns multiple lines of json
        const lines = strData.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        lines.forEach(line => {
          try {
            const json = JSON.parse(line);

            if (json && json.status) {
              if (json.status === 'Downloading') {
                this.sendDownloadProgress(
                  container,
                  json.progressDetail.id,
                  json.progressDetail.current,
                  json.progressDetail.total
                );
              } else {
                this.logService.log(container, json.status);
              }
            } else {
              this.logService.log(container, line);
            }
          } catch {
            this.logService.log(container, line);
          }
        })
      })

      stream.on('end', resolve)
      stream.on('error', reject)
    });

  private sendDownloadProgress = (container: string, id: string, current: number, total: number) =>
    this.messagingService.sendMessage({
      type: 'log',
      log: {
        container,
        progress: { type: 'Downloading', id, current, total }
      }
    })
}
