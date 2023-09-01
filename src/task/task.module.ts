import { Module } from '@nestjs/common';
import { BacklogTaskService } from './task.service';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { I_BACKLOG_TASK_SERVICE } from './interfaces';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [DatabaseModule, MemberModule],
  providers: [
    {
      provide: I_BACKLOG_TASK_SERVICE,
      useClass: BacklogTaskService,
    },
  ],
  exports: [I_BACKLOG_TASK_SERVICE],
})
export class TaskModule {}
