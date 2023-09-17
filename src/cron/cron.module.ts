import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CronService } from './cron.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { I_CRON_SERVICE } from './interfaces/cron.service.interface';
import { SupportModule } from 'src/public/public.module';

@Module({
  imports: [
    CacheModule.register(),
    SupportModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        GG_CHAT_WEBHOOK: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    {
      provide: I_CRON_SERVICE,
      useClass: CronService,
    },
  ],
})
export class CronModule {}
