import { BacklogItem, BacklogTask, Iteration } from '@ld3v/nqh-shared';
import { TTransformResult } from 'src/app/interfaces';
import { IBacklogResponse, ICreateBacklogItem, TBacklogPreview } from '.';

export const I_BACKLOG_SERVICE = 'I-BACKLOG-SERVICE';

export interface IBacklogService {
  create(data: ICreateBacklogItem): Promise<BacklogItem>;
  getById(id: string): Promise<BacklogItem>;
  moveToIteration(bli: BacklogItem, iteration: Iteration): Promise<BacklogItem>;
  addTask(bli: BacklogItem, task: BacklogTask): Promise<BacklogItem>;

  // Transform data
  _transform(bli: BacklogItem): IBacklogResponse;
  _transformPreview(bli: BacklogItem): TBacklogPreview;
  _transformMulti(
    bl: BacklogItem[],
  ): TTransformResult<IBacklogResponse, TBacklogPreview>;
}
