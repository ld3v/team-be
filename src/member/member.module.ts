import { Module } from '@nestjs/common';
import { I_MEMBER_SERVICE } from './interfaces';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { MemberService } from './member.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: I_MEMBER_SERVICE,
      useClass: MemberService,
    },
  ],
  exports: [I_MEMBER_SERVICE],
})
export class MemberModule {}
