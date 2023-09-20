import { Controller, Get, Post, Inject, Req, UseGuards } from '@nestjs/common';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import { OptionalCookieGuard } from 'src/auth/guards';
import { IRequestWithAccount } from 'src/auth/interfaces';
import {
  ICronService,
  I_CRON_SERVICE,
} from 'src/cron/interfaces/cron.service.interface';

@Controller('')
export class AppController {
  constructor(
    @Inject(I_ACCOUNT_SERVICE) private readonly accountService: IAccountService,
    @Inject(I_CRON_SERVICE) private readonly cronService: ICronService,
  ) {}

  @Get('status')
  @UseGuards(OptionalCookieGuard)
  public checkHealth(@Req() { user }: IRequestWithAccount) {
    return { user: user ? this.accountService._transform(user) : null };
  }

  @Post('manual')
  public async manual() {
    return await this.cronService.dailyMeetingReminder();
  }
}
