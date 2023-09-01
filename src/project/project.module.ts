import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { I_PROJECT_SERVICE } from './interfaces';
import { ProgramModule } from 'src/program/program.module';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { IterationModule } from 'src/iteration/iteration.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ProgramModule),
    forwardRef(() => IterationModule),
    MemberModule,
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: I_PROJECT_SERVICE,
      useClass: ProjectService,
    },
  ],
  exports: [I_PROJECT_SERVICE],
})
export class ProjectModule {}
