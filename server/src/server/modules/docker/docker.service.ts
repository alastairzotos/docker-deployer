import { Stream, Readable } from 'stream';
import { Docker } from 'node-docker-api';
import { Container } from 'node-docker-api/lib/container';
import * as prettyBytes from 'pretty-bytes';
import { MessagingService } from '../messaging/messaging.service';
import { ContainerStats, ContainerStatus, DeploymentInfo } from '../../models';
import { LogService } from '../log/log.service';
import { Service } from 'typedi';
import { TimeService } from '../time/time.service';

@Service()
export class DockerService {
  private readonly docker: Docker;

  constructor(
    private messagingService: MessagingService,
    private logService: LogService,
    private timeService: TimeService
  ) {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  pullImage = async (containerName: string, image: string, tag: string) =>
    await this.docker.image.create({}, { fromImage: image, tag })
      .then(stream => this.promisifyPullStream(stream as any as Stream, containerName));

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

  getContainerById = async (id: string): Promise<Container> => {
    return await this.docker.container.get(id);
  }

  getContainerLogs = async (id: string): Promise<void> => {
    const container = await this.docker.container.get(id);

    if (container) {
      const logsStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        tail: 100
      }) as any as Readable;

      logsStream.on('data', (data: Buffer) => {
        this.messagingService.sendMessage({
          type: 'logs',
          containerLogs: {
            id,
            logs: data.toString().split('\n')
          }
        })
      })
    }
  }

  getContainerStats = async (id: string) => {
    const container = await this.docker.container.get(id);

    if (container) {
      const statsStream = await container.stats() as any as Readable;

      statsStream.on('data', (data: Buffer) => {
        const stats = JSON.parse(data.toString());

        if (!!stats && !!stats.cpu_stats && !!stats.memory_stats && !!stats.networks && Object.keys(stats.networks).length > 0) {
          const cpuUsage = stats.cpu_stats.cpu_usage.total_usage as number;
          const systemCpuUsage = stats.cpu_stats.system_cpu_usage as number;

          const memUsage = stats.memory_stats.usage as number;
          const limit = stats.memory_stats.limit as number;

          const networkKey = Object.keys(stats.networks)[0];
          const rxBytes = stats.networks[networkKey].rx_bytes;
          const txBytes = stats.networks[networkKey].tx_bytes;

          const statsData: ContainerStats = {
            cpuPerc: (cpuUsage / systemCpuUsage) * 100,
            memPerc: (memUsage / limit) * 100,
            memUsage: `${prettyBytes(memUsage)} / ${prettyBytes(limit)}`,
            netIOUsage: `${prettyBytes(rxBytes)} / ${prettyBytes(txBytes)}`
          };

          this.messagingService.sendMessage({
            type: 'stats',
            containerStats: {
              id,
              stats: statsData
            }
          });
        }
      });
    }
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

  private promisifyPullStream = (stream: Stream, container: string) =>
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
      type: 'output',
      output: {
        container,
        progress: { type: 'Downloading', id, current, total }
      }
    })
}
