import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';
import {
  IIterationService,
  IIterationResponse,
  ICreateIterationInput,
  TIterationPreview,
} from './interfaces';
import { Account, Iteration } from 'src/app/datasource/entities';
import {
  IIterationRepository,
  I_ITERATION_REPOSITORY,
} from 'src/app/datasource/interfaces';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import MESSAGES from 'common/messages';
import { TTransformResult } from 'src/app/interfaces/transform';

@Injectable()
export class IterationService implements IIterationService {
  constructor(
    @Inject(I_ITERATION_REPOSITORY)
    private readonly iterationRepository: IIterationRepository,
    @Inject(I_PROJECT_SERVICE) private readonly projectService: IProjectService,
  ) {}

  public async create(
    data: ICreateIterationInput,
    requester: Account,
  ): Promise<Iteration> {
    try {
      const project = await this.projectService.getById(
        data.projectId,
        requester,
      );
      if (!project) {
        throw new BadRequestException(MESSAGES.program.NOT_EXIST);
      }
      if (
        moment(data.startAt)
          .startOf('day')
          .isSameOrAfter(moment(data.finishAt).startOf('day'))
      ) {
        throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
      }
      return await this.iterationRepository.create({
        ...data,
        project,
      });
    } catch (error) {
      throw error;
    }
  }

  public async search(
    projectId: string,
    requester: Account,
  ): Promise<Iteration[]> {
    try {
      const member = await this.projectService.getMemberByAccount(
        projectId,
        requester,
      );
      if (!member) {
        throw new BadRequestException(MESSAGES.project.NOT_MEMBER);
      }
      const project = await this.iterationRepository.getIterationById(
        projectId,
        member,
      );
      if (!project) {
        throw new BadRequestException(MESSAGES.project.NOT_EXIST);
      }
      return await this.iterationRepository.getIterations(member);
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string, requester: Account): Promise<Iteration> {
    try {
      const member = await this.projectService.getMemberByAccount(
        id,
        requester,
      );
      if (!member) {
        throw new BadRequestException(MESSAGES.project.NOT_MEMBER);
      }
      return await this.iterationRepository.getIterationById(id, member);
    } catch (error) {
      throw error;
    }
  }

  public _transform(iteration: Iteration): IIterationResponse {
    const data = {
      ...iteration,
      projectId: iteration.project ? iteration.project.id : undefined,
    };
    delete data.project;

    return data;
  }

  public _transformPreview(iteration: Iteration): TIterationPreview {
    return {
      id: iteration.id,
      name: iteration.name,
      description: iteration.description,
      isClosed: iteration.isClosed,
    };
  }

  public _transformMulti(
    iterations: Iteration[],
  ): TTransformResult<IIterationResponse, TIterationPreview> {
    const res = {
      previews: [],
      data: [],
    };
    iterations.forEach((itr) => {
      res.data.push(this._transform(itr));
      res.previews.push(this._transformPreview(itr));
    });

    return res;
  }
}
