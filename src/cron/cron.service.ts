import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { sendDailyLogworkNotify, sendDailyMeetingNotify } from './jobs';
import { ConfigService } from '@nestjs/config';
import { randomMember } from 'common/func';
import { APM_MEMBERS } from 'common/constants';
import { ISupportService, I_SUPPORT_SERVICE } from 'src/public/interfaces';
import * as moment from 'moment';

const DS_NAME_START_WITH = 'apm: daily scrum';

@Injectable()
export class CronService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(I_SUPPORT_SERVICE) private readonly supportService: ISupportService,
  ) {}

  @Cron('* * * * *', {
    name: 'daily_meeting_reminder',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async dailyMeetingReminder() {
    try {
      //
      const events = await this.supportService.getEventsToday();
      const dsEvent = events.find((ev) =>
        ev.summary.toLowerCase().startsWith(DS_NAME_START_WITH),
      );
      console.log(events);
      if (!dsEvent) {
        Logger.log('Today have no DS meetings');
        return;
      }
      Logger.log(
        'Found an DS meeting will be started at ' +
          moment(dsEvent.startedAt).format('DD/MM/YYYY HH:mm:ss'),
      );
      const memberEmails = JSON.parse(dsEvent.members) as string[];
      const membersJoin = Array.isArray(memberEmails)
        ? memberEmails.map((m) => m.replace('.tpv@one-line.com', ''))
        : undefined;

      const hook = this.configService.get<string>('GG_CHAT_WEBHOOK');
      const memberHosted = randomMember(APM_MEMBERS, membersJoin);
      const membersQuery = Object.keys(APM_MEMBERS)
        .map((mem) => (mem === memberHosted.alias ? `_${mem}` : mem))
        .join('@');
      const membersEncoded = encodeURIComponent(membersQuery);
      const res = await sendDailyMeetingNotify(
        hook,
        memberHosted,
        dsEvent.startedAt,
        {
          meetingLink: dsEvent.meetingLink,
          eventLink: dsEvent.eventLink,
          newHostedLink: `https://team.nqhuy.dev/p/tools/random/${membersEncoded}`,
        },
      );
      console.log(res, '\n', '----------------------------------------------');
    } catch (error) {
      console.log(error);
      Logger.error(
        'Something went wrong when run job dailyMeetingReminder: ' +
          error.message,
      );
    }
  }

  @Cron('0 17 * * 1-5', {
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
