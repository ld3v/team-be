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

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
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
  ],
  controllers: [AppController],
})
export class AppModule {}
