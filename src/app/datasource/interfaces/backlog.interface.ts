import { TEntityOptionFields } from '.';
import { BacklogItem, BacklogTask, ProjectMember } from '../entities';
import { IRepository } from '../repositories';

export type TBacklogItemEntity = Omit<BacklogItem, TEntityOptionFields>;
export type TBacklogTaskEntity = Omit<BacklogTask, TEntityOptionFields>;

export const I_BACKLOG_ITEM_REPOSITORY = 'I-BACKLOG-ITEM-REPOSITORY';
export const I_BACKLOG_TASK_REPOSITORY = 'I-BACKLOG-TASK-REPOSITORY';

export interface IBacklogItemRepository extends IRepository<BacklogItem> {
  getItems(
    projectId: string,
    requester: ProjectMember,
    iterationId?: string,
  ): Promise<BacklogItem[]>;
  getItemById(
    id: string,
    requester: ProjectMember,
  ): Promise<BacklogItem | null>;
}

export interface IBacklogTaskRepository extends IRepository<BacklogTask> {
  getItems(backlogId: string, requester: ProjectMember): Promise<BacklogTask[]>;
  getItemById(
    id: string,
    requester: ProjectMember,
  ): Promise<BacklogTask | null>;
}
