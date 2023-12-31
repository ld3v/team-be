import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { I_ACCOUNT_SERVICE } from './interfaces/account.service.interface';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    {
      provide: I_ACCOUNT_SERVICE,
      useClass: AccountService,
    },
  ],
  exports: [I_ACCOUNT_SERVICE],
})
export class AccountModule {}
