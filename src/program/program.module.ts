import { Module, forwardRef } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { I_PROGRAM_SERVICE } from './interfaces';
import { ProjectModule } from 'src/project/project.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [AccountModule, forwardRef(() => ProjectModule)],
  controllers: [ProgramController],
  providers: [
    {
      provide: I_PROGRAM_SERVICE,
      useClass: ProgramService,
    },
  ],
  exports: [I_PROGRAM_SERVICE],
})
export class ProgramModule {}
