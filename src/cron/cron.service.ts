import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ICronService } from './interfaces/cron.service.interface';
import { sendDailyLogworkNotify } from './jobs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CronService implements ICronService {
  constructor(private readonly configService: ConfigService) {}

  @Cron('30 17 * * *', {
    name: 'daily_logwork_reminder',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async dailyLogTaskReminder() {
    try {
      console.log('Run');
      const hook = this.configService.get<string>('GG_CHAT_WEBHOOK');
      const res = await sendDailyLogworkNotify(hook);
      console.log(res);
    } catch (error) {
      Logger.error(
        'Something went wrong when run job dailyLogTaskReminder: ' +
          error.message,
      );
    }
  }
}
