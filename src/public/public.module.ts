import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { SupportService } from './public.service';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { I_SUPPORT_SERVICE } from './interfaces';

@Module({
  imports: [DatabaseModule],
  controllers: [PublicController],
  providers: [
    {
      provide: I_SUPPORT_SERVICE,
      useClass: SupportService,
    },
  ],
})
export class PublicModule {}
