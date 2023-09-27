import {
  Inject,
  Injectable,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import * as moment from 'moment';
import {
  IIterationService,
  IIterationResponse,
  ICreateIterationInput,
  IIterationPreview,
} from './interfaces';
import {
  IIterationRepository,
  I_ITERATION_REPOSITORY,
  Iteration,
  Project,
} from '@ld3v/nqh-shared';
import { IProjectService, I_PROJECT_SERVICE } from 'src/project/interfaces';
import MESSAGES from 'common/messages';
import { TTransformResult } from 'src/app/interfaces/transform';

@Injectable()
export class IterationService implements IIterationService {
  constructor(
    @Inject(I_ITERATION_REPOSITORY)
    private readonly iterationRepository: IIterationRepository,
    @Inject(forwardRef(() => I_PROJECT_SERVICE))
    private readonly projectService: IProjectService,
  ) {}

  public async getCurrentByProjectId(projectId: string): Promise<Iteration> {
    return await this.iterationRepository.getCurrent(projectId);
  }

  public async create(data: ICreateIterationInput): Promise<Iteration> {
    try {
      if (
        moment(data.startAt)
          .startOf('day')
          .isSameOrAfter(moment(data.finishAt).startOf('day'))
      ) {
        throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
      }
      return await this.iterationRepository.create({
        ...data,
      });
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<Iteration> {
    try {
      return await this.iterationRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  public async findByProject(project: Project): Promise<Iteration[]> {
    try {
      return await this.iterationRepository.getItemsByProjectId(project.id);
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

  public _transformPreview(iteration: Iteration): IIterationPreview {
    return {
      id: iteration.id,
      name: iteration.name,
      description: iteration.description,
      isClosed: iteration.isClosed,
      dates: [
        moment(iteration.startAt).toDate(),
        moment(iteration.finishAt).toDate(),
      ],
    };
  }

  public _transformMulti(
    iterations: Iteration[],
  ): TTransformResult<IIterationResponse, IIterationPreview> {
    const res = {
      previews: [],
      data: [],
    };
    iterations?.forEach((itr) => {
      res.data.push(this._transform(itr));
      res.previews.push(this._transformPreview(itr));
    });

    return res;
  }
}
