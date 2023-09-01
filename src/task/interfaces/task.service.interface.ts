import { BacklogTask, Member, TaskLog } from 'src/app/datasource/entities';
import { TTransformResult } from 'src/app/interfaces';
import { ICreateTaskLogInput, ITaskLogResponse } from '.';
import { CreateTaskDTO, UpdateTaskDTO } from '../dto';
import { IMemberResponse } from 'src/project/interfaces';
import { TBacklogTaskEntity } from 'src/app/datasource/interfaces';

export const I_BACKLOG_TASK_SERVICE = 'I-BACKLOG-TASK-SERVICE';

export interface IUpdateTaskInput extends Omit<UpdateTaskDTO, 'picId'> {
  pic: Member;
}

export interface IBacklogTaskPreview
  extends Pick<TBacklogTaskEntity, 'id' | 'name' | 'status' | 'dueDate'> {
  pic: IMemberResponse;
}

export interface IBacklogTaskResponse extends IBacklogTaskPreview {
  logs: ITaskLogResponse[];
}

export interface IBacklogTaskService {
  create(data: CreateTaskDTO): Promise<BacklogTask>;
  getById(id: string): Promise<BacklogTask & { totalTimeSpent: number }>;
  update(
    task: BacklogTask,
    data: IUpdateTaskInput,
  ): Promise<BacklogTask & { totalTimeSpent: number }>;
  delete(task: BacklogTask): Promise<boolean>;
  // Work logs
  addLogwork(
    task: BacklogTask,
    data: ICreateTaskLogInput,
  ): Promise<BacklogTask & { totalTimeSpent: number }>;

  // Transform data
  _transform(task: BacklogTask): IBacklogTaskResponse;
  _transformLog(log: TaskLog): ITaskLogResponse;
  _transformPreview(task: BacklogTask): IBacklogTaskPreview;
  _transformMulti(
    tasks: BacklogTask[],
  ): TTransformResult<IBacklogTaskResponse, IBacklogTaskPreview>;
}
