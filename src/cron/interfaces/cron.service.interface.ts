export const I_CRON_SERVICE = 'I-CRON-SERVICE';

export interface ICronService {
  dailyLogTaskReminder: () => Promise<void>;
  dailyMeetingReminder: () => Promise<void>;
}
