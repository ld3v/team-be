export interface ICronService {
  dailyLogTaskReminder: () => Promise<void>;
}
