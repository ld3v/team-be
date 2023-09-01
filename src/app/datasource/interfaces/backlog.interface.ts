import { TEntityOptionFields } from '.';
import { BacklogItem, BacklogTask, TaskLog } from '../entities';
import { IRepository } from '../repositories';

export type TBacklogItemEntity = Omit<BacklogItem, TEntityOptionFields>;
export type TBacklogTaskEntity = Omit<BacklogTask, TEntityOptionFields>;

export const I_BACKLOG_ITEM_REPOSITORY = 'I-BACKLOG-ITEM-REPOSITORY';
export const I_BACKLOG_TASK_REPOSITORY = 'I-BACKLOG-TASK-REPOSITORY';
export const I_TASKLOG_REPOSITORY = 'I-BACKLOG-TASK-REPOSITORY';

export interface IBacklogItemRepository extends IRepository<BacklogItem> {
  getItems(projectId: string, iterationId?: string): Promise<BacklogItem[]>;
}

export interface IBacklogTaskRepository extends IRepository<BacklogTask> {
  getItems(backlogId: string): Promise<BacklogTask[]>;
  findById(taskId: string): Promise<BacklogTask & { totalTimeSpent: number }>;
  addLog(task: BacklogTask, logwork: TaskLog): Promise<BacklogTask>;
}

export interface ITaskLogRepository extends IRepository<TaskLog> {
  getItems(taskId: string): Promise<TaskLog[]>;
}
