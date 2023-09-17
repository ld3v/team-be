import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '.';
import {
  Program,
  Project,
  Account,
  Iteration,
  BacklogItem,
  BacklogTask,
  Member,
  Workload,
  TaskLog,
  SPGoogleEvent,
} from './entities';
import {
  I_PROJECT_REPOSITORY,
  I_ACCOUNT_REPOSITORY,
  I_PROGRAM_REPOSITORY,
  I_ITERATION_REPOSITORY,
  I_MEMBER_REPOSITORY,
  I_WORKLOAD_REPOSITORY,
  I_BACKLOG_ITEM_REPOSITORY,
  I_BACKLOG_TASK_REPOSITORY,
  I_TASKLOG_REPOSITORY,
  I_SP_GOOGLE_EVENT_REPOSITORY,
} from './interfaces';
import {
  ProjectRepository,
  AccountRepository,
  ProgramRepository,
  IterationRepository,
  MemberRepository,
  WorkloadRepository,
  BacklogItemRepository,
  BacklogTaskRepository,
  TaskLogRepository,
  SPGoogleEventRepository,
} from './repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([
      Program,
      Project,
      Member,
      Workload,
      Account,
      Iteration,
      BacklogItem,
      BacklogTask,
      TaskLog,
      SPGoogleEvent,
    ]),
  ],
  providers: [
    {
      provide: I_ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
    {
      provide: I_PROGRAM_REPOSITORY,
      useClass: ProgramRepository,
    },
    {
      provide: I_PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: I_MEMBER_REPOSITORY,
      useClass: MemberRepository,
    },
    {
      provide: I_WORKLOAD_REPOSITORY,
      useClass: WorkloadRepository,
    },
    {
      provide: I_ITERATION_REPOSITORY,
      useClass: IterationRepository,
    },
    {
      provide: I_BACKLOG_ITEM_REPOSITORY,
      useClass: BacklogItemRepository,
    },
    {
      provide: I_BACKLOG_TASK_REPOSITORY,
      useClass: BacklogTaskRepository,
    },
    {
      provide: I_TASKLOG_REPOSITORY,
      useClass: TaskLogRepository,
    },
    {
      provide: I_SP_GOOGLE_EVENT_REPOSITORY,
      useClass: SPGoogleEventRepository,
    },
  ],
  exports: [
    I_ACCOUNT_REPOSITORY,
    I_PROGRAM_REPOSITORY,
    I_PROJECT_REPOSITORY,
    I_MEMBER_REPOSITORY,
    I_WORKLOAD_REPOSITORY,
    I_ITERATION_REPOSITORY,
    I_BACKLOG_ITEM_REPOSITORY,
    I_BACKLOG_TASK_REPOSITORY,
    I_TASKLOG_REPOSITORY,
    I_SP_GOOGLE_EVENT_REPOSITORY,
  ],
})
export class DatabaseModule {}
