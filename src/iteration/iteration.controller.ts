import {
  Controller,
  Post,
  Body,
  Req,
  Inject,
  UseGuards,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import {
  IIterationService,
  IIterationResponse,
  I_ITERATION_SERVICE,
} from './interfaces';
import { JWTAuthGuard } from 'src/auth/guards';
import { CreateIterationDTO } from './dto';
import { IRequestWithAccount } from 'src/auth/interfaces';
import * as moment from 'moment';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import MESSAGES from 'common/messages';
import { common } from '@ld3v/nqh-shared';

const { ResponseObject } = common;

@Controller('iterations')
export class IterationController {
  constructor(
    @Inject(I_ITERATION_SERVICE)
    private readonly iterationService: IIterationService,
    @Inject(forwardRef(() => I_PROJECT_SERVICE))
    private readonly projectService: IProjectService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  public async create(
    @Body() { projectId, ...input }: CreateIterationDTO,
    @Req() { user }: IRequestWithAccount,
  ) {
    try {
      const project = await this.projectService.isAccessible(projectId, user);
      const currentItr = await this.iterationService.getCurrentByProjectId(
        projectId,
      );
      if (currentItr) {
        throw new BadRequestException(MESSAGES.iteration.EXIST_CURRENT);
      }
      const newIteration = await this.iterationService.create({
        ...input,
        project,
        startAt: moment(input.startAt).startOf('day').toDate(),
        finishAt: moment(input.finishAt).startOf('day').toDate(),
      });
      const data = this.iterationService._transform(newIteration);

      return ResponseObject.success<IIterationResponse>(data);
    } catch (error) {
      throw error;
    }
  }
}
