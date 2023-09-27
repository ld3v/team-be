import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards';
import { CreateBacklogDTO, MoveBacklogToIterationDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';
import { IBacklogService, I_BACKLOG_SERVICE } from './interfaces';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import {
  IIterationService,
  I_ITERATION_SERVICE,
} from 'src/iteration/interfaces';
import MESSAGES from 'common/messages';
import { CreateTaskDTO } from 'src/task/dto';
import {
  IBacklogTaskService,
  I_BACKLOG_TASK_SERVICE,
} from 'src/task/interfaces';
import { common } from '@ld3v/nqh-shared';

const { ResponseObject } = common;

@Controller('backlog')
export class BacklogController {
  constructor(
    @Inject(I_BACKLOG_SERVICE) private readonly backlogService: IBacklogService,
    @Inject(I_PROJECT_SERVICE) private readonly projectService: IProjectService,
    @Inject(I_ITERATION_SERVICE)
    private readonly iterationService: IIterationService,
    @Inject(I_BACKLOG_TASK_SERVICE)
    private readonly taskService: IBacklogTaskService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async createBacklog(
    @Body() data: CreateBacklogDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    // This will got Project if this user is a member or participant of the Program.
    const project = await this.projectService.isAccessible(
      data.projectId,
      user,
    );

    const newBacklog = await this.backlogService.create({
      ...data,
      project,
    });

    return ResponseObject.success(this.backlogService._transform(newBacklog));
  }

  @Patch(':id/move-to-iteration')
  @UseGuards(JWTAuthGuard)
  async moveBacklogToIteration(
    @Param('id') id: string,
    @Body() { iterationId }: MoveBacklogToIterationDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    await this.projectService.isAccessible(id, user, 'backlog');

    const bli = await this.backlogService.getById(id);
    if (!bli) {
      throw new BadRequestException(MESSAGES.common.NOT_EXIST('backlog'));
    }

    const iteration = await this.iterationService.getById(iterationId);
    const updated = await this.backlogService.moveToIteration(bli, iteration);

    return ResponseObject.success(this.backlogService._transform(updated));
  }

  @Post(':id/task')
  @UseGuards(JWTAuthGuard)
  async addTask(
    @Param('id') id: string,
    @Body() data: CreateTaskDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    await this.projectService.isAccessible(id, user, 'backlog');

    const bli = await this.backlogService.getById(id);
    if (!bli) {
      throw new BadRequestException(MESSAGES.common.NOT_EXIST('backlog'));
    }

    const newTask = await this.taskService.create(data);
    const updated = await this.backlogService.addTask(bli, newTask);

    return ResponseObject.success(this.backlogService._transform(updated));
  }
}
