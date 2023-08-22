import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { I_PROJECT_SERVICE } from './interfaces';
import { ProgramModule } from 'src/program/program.module';
import { DatabaseModule } from 'src/app/datasource/database.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ProgramModule)],
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
