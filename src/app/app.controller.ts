import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import { OptionalCookieGuard } from 'src/auth/guards';
import { IRequestWithAccount } from 'src/auth/interfaces';

@Controller('')
export class AppController {
  constructor(
    @Inject(I_ACCOUNT_SERVICE) private readonly accountService: IAccountService,
  ) {}

  @Get('status')
  @UseGuards(OptionalCookieGuard)
  public checkHealth(@Req() { user }: IRequestWithAccount) {
    return { user: user ? this.accountService._transform(user) : null };
  }
}
