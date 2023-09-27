import { Inject, Injectable } from '@nestjs/common';
import {
  IBacklogResponse,
  IBacklogService,
  ICreateBacklogItem,
  TBacklogPreview,
} from './interfaces';
import {
  IBacklogItemRepository,
  I_BACKLOG_ITEM_REPOSITORY,
  BacklogItem,
  BacklogTask,
  Iteration,
} from '@ld3v/nqh-shared';
import { TTransformResult } from 'src/app/interfaces/transform';

@Injectable()
export class BacklogService implements IBacklogService {
  constructor(
    @Inject(I_BACKLOG_ITEM_REPOSITORY)
    private readonly backlogRepository: IBacklogItemRepository,
  ) {}

  public async create(data: ICreateBacklogItem): Promise<BacklogItem> {
    return await this.backlogRepository.create({
      ...data,
    });
  }

  public async getById(id: string): Promise<BacklogItem> {
    return await this.backlogRepository.findById(id);
  }

  public async moveToIteration(
    bli: BacklogItem,
    iteration: Iteration,
  ): Promise<BacklogItem> {
    return await this.backlogRepository.updateById(bli.id, { iteration });
  }

  public async addTask(
    bli: BacklogItem,
    task: BacklogTask,
  ): Promise<BacklogItem> {
    return await this.backlogRepository.updateById(bli.id, {
      tasks: [...bli.tasks, task],
    });
  }

  public _transform(bli: BacklogItem): IBacklogResponse {
    const data = { ...bli, projectId: bli.project.id };
    delete data.project;

    return data;
  }

  public _transformPreview(bli: BacklogItem): TBacklogPreview {
    return {
      id: bli.id,
      name: bli.name,
      description: bli.description,
      status: bli.status,
    };
  }

  public _transformMulti(
    bl: BacklogItem[],
  ): TTransformResult<IBacklogResponse, TBacklogPreview> {
    const res = {
      previews: [],
      data: [],
    };
    bl?.forEach((bli) => {
      res.previews.push(this._transformPreview(bli));
      res.data.push(this._transform(bli));
    });
    return res;
  }
}
