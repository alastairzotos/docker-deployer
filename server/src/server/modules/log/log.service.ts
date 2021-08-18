import { Service } from "typedi";
import { MessagingService } from "../messaging/messaging.service";

@Service()
export class LogService {
  private logs: string[] = [];

  constructor(private readonly messagingService: MessagingService) {}

  log = (containerName: string, message: string) => {
    this.logs.push(message);

    this.messagingService.sendMessage({
      type: 'log',
      log: {
        container: containerName,
        date: new Date(),
        message: message
      }
    })
  }

  flush = () => {
    const result = [...this.logs];
    this.logs = [];

    return result;
  }
}