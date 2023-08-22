import { Module } from '@nestjs/common';
import { IterationController } from './iteration.controller';
import { IterationService } from './iteration.service';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { ProjectModule } from 'src/project/project.module';
import { I_ITERATION_SERVICE } from './interfaces/iteration.service.interface';

@Module({
  imports: [DatabaseModule, ProjectModule],
  controllers: [IterationController],
  providers: [
    {
      provide: I_ITERATION_SERVICE,
      useClass: IterationService,
    },
  ],
  exports: [I_ITERATION_SERVICE],
})
export class IterationModule {}
