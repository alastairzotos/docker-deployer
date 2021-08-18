import TimeAgo from 'javascript-time-ago';
import * as en from 'javascript-time-ago/locale/en'
import { Service } from 'typedi';

@Service()
export class TimeService {
  private readonly timeAgo: TimeAgo;

  constructor() {
    TimeAgo.addDefaultLocale(en);
    this.timeAgo = new TimeAgo('en-US');
  }

  format = (date: Date) =>
    this.timeAgo.format(date.getTime());
}
