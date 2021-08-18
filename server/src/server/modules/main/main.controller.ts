import * as express from 'express';
import { Service } from 'typedi';
import { DeploymentInfo } from '../../models';
import { MainService } from './main.service';

@Service()
export class MainController {
  constructor(private readonly service: MainService) { }

  deploy = async (req: express.Request, res: express.Response) => {
    const deploymentInfo = req.body as DeploymentInfo;

    res.json({
      response: await this.service.handleDeploy({ tag: 'latest', ...deploymentInfo })
    });
  };

  triggerBroadcast = async (_: express.Request, res: express.Response) => {
    await this.service.broadcastStatus();
    res.sendStatus(201);
  }
}
