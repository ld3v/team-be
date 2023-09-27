import { Module } from '@nestjs/common';
import { BacklogTaskService } from './task.service';
import { RepositoriesModule } from '@ld3v/nqh-shared';
import { I_BACKLOG_TASK_SERVICE } from './interfaces';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [MemberModule],
  providers: [
    {
      provide: I_BACKLOG_TASK_SERVICE,
      useClass: BacklogTaskService,
    },
  ],
  exports: [I_BACKLOG_TASK_SERVICE],
})
export class TaskModule {}
