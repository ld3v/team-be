import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app/app.controller';
import { ProgramModule } from 'src/program/program.module';
import { ProjectModule } from 'src/project/project.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';
import { IterationModule } from './iteration/iteration.module';
import { BacklogModule } from './backlog/backlog.module';
import { TaskModule } from './task/task.module';
import { MemberModule } from './member/member.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IntegrateModule } from './integrate/integrate.module';
import { RepositoriesModule } from '@ld3v/nqh-shared';
import { common } from '@ld3v/nqh-shared';

const { env } = common;

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
    RepositoriesModule.forRoot(
      {
        database: env().DB_DATABASE,
        host: env().DB_HOST,
        port: env().DB_PORT,
        username: env().DB_USERNAME,
        password: env().DB_PASSWORD,
      },
      undefined,
      true,
    ),
    IterationModule,
    BacklogModule,
    TaskModule,
    MemberModule,
    IntegrateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
