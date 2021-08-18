import * as express from 'express';
import * as cors from 'cors';
import { Service } from "typedi";
import { CoreService } from '../../../core';

@Service()
export class AppService {
  app: express.Express;

  constructor(
    private readonly coreService: CoreService,
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  listen = () =>
    this.app.listen(
      this.coreService.httpPort,
      () => console.log(`App server listening on http://localhost:${this.coreService.httpPort}`)
    )
}
