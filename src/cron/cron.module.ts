import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        GG_CHAT_WEBHOOK: Joi.string().required(),
      }),
    }),
  ],
  providers: [CronService],
})
export class CronModule {}
