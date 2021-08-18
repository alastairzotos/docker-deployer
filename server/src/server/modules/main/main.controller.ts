import * as express from 'express';
import { Service } from 'typedi';
import { ContainerStats, DeploymentInfo } from '../../models';
import { DockerService } from '../docker/docker.service';
import { MainService } from './main.service';

@Service()
export class MainController {
  constructor(
    private readonly mainService: MainService,
    private readonly dockerService: DockerService
  ) { }

  deploy = async (req: express.Request, res: express.Response) => {
    const deploymentInfo = req.body as DeploymentInfo;

    res.json({
      response: await this.mainService.handleDeploy({ tag: 'latest', ...deploymentInfo })
    });
  };

  triggerBroadcast = async (_: express.Request, res: express.Response) => {
    await this.mainService.broadcastStatus();
    res.sendStatus(201);
  }

  getContainerStats = async (req: express.Request, res: express.Response) => {
    res.send(await this.dockerService.getContainerStats(req.query.id as string));
  }

  getContainerLogs = async (req: express.Request, res: express.Response) => {
    res.send(await this.dockerService.getContainerLogs(req.query.id as string));
  }
}
