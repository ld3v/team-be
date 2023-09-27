import { Module } from '@nestjs/common';
import { BacklogController } from './backlog.controller';
import { BacklogService } from './backlog.service';
import { I_BACKLOG_SERVICE } from './interfaces';
import { IterationModule } from 'src/iteration/iteration.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ProjectModule, IterationModule, TaskModule],
  controllers: [BacklogController],
  providers: [
    {
      provide: I_BACKLOG_SERVICE,
      useClass: BacklogService,
    },
  ],
  exports: [I_BACKLOG_SERVICE],
})
export class BacklogModule {}
