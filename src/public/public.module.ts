import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PublicController } from './public.controller';
import { SupportService } from './public.service';
import { DatabaseModule } from 'src/app/datasource/database.module';
import { I_SUPPORT_SERVICE } from './interfaces';

@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [PublicController],
  providers: [
    {
      provide: I_SUPPORT_SERVICE,
      useClass: SupportService,
    },
  ],
  exports: [I_SUPPORT_SERVICE],
})
export class SupportModule {}
