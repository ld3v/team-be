import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app/app.controller';
import { ProgramModule } from 'src/program/program.module';
import { ProjectModule } from 'src/project/project.module';
import { DatabaseModule } from './app/datasource/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';
import { IterationModule } from './iteration/iteration.module';
import { BacklogModule } from './backlog/backlog.module';
import { TaskModule } from './task/task.module';
import { MemberModule } from './member/member.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    ProgramModule,
    ProjectModule,
    AuthModule,
    AccountModule,
    AppModule,
    DatabaseModule,
    IterationModule,
    BacklogModule,
    TaskModule,
    MemberModule,
    CronModule,
    PublicModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
