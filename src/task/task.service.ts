import { Inject, Injectable } from '@nestjs/common';
import {
  IBacklogTaskPreview,
  IBacklogTaskResponse,
  IBacklogTaskService,
  ICreateTaskLogInput,
  IUpdateTaskInput,
  ITaskLogResponse,
} from './interfaces';
import { BacklogTask, TaskLog } from 'src/app/datasource/entities';
import {
  IBacklogTaskRepository,
  ITaskLogRepository,
  I_BACKLOG_TASK_REPOSITORY,
  I_TASKLOG_REPOSITORY,
} from 'src/app/datasource/interfaces';
import { TTransformResult } from 'src/app/interfaces';
import { CreateTaskDTO } from './dto';
import { IMemberService, I_MEMBER_SERVICE } from 'src/project/interfaces';

@Injectable()
export class BacklogTaskService implements IBacklogTaskService {
  constructor(
    @Inject(I_BACKLOG_TASK_REPOSITORY)
    private readonly taskRepository: IBacklogTaskRepository,
    @Inject(I_TASKLOG_REPOSITORY)
    private readonly tasklogRepository: ITaskLogRepository,
    @Inject(I_MEMBER_SERVICE)
    private readonly memberService: IMemberService,
  ) {}

  public async getById(
    id: string,
  ): Promise<BacklogTask & { totalTimeSpent: number }> {
    return await this.taskRepository.findById(id);
  }

  public async create(data: CreateTaskDTO): Promise<BacklogTask> {
    return await this.taskRepository.create(data);
  }

  public async update(
    task: BacklogTask,
    data: IUpdateTaskInput,
  ): Promise<BacklogTask & { totalTimeSpent: number }> {
    await this.taskRepository.updateById(task.id, data);
    return await this.taskRepository.findById(task.id);
  }

  public async delete(task: BacklogTask): Promise<boolean> {
    return await this.taskRepository.deleteById(task.id);
  }

  public async addLogwork(
    task: BacklogTask,
    data: ICreateTaskLogInput,
  ): Promise<BacklogTask & { totalTimeSpent: number }> {
    const newLog = await this.tasklogRepository.create(data);
    await this.taskRepository.addLog(task, newLog);
    return await this.taskRepository.findById(task.id);
  }

  public _transformLog(log: TaskLog): ITaskLogResponse {
    if (!log) return null;
    const { id, message, timeSpent, date, member } = log;

    return {
      id,
      message,
      timeSpent,
      date,
      member: this.memberService._transform(member),
    };
  }

  public _transformMultiLogs(logs: TaskLog[]): ITaskLogResponse[] {
    return logs.map((log) => this._transformLog(log));
  }

  public _transformPreview(task: BacklogTask): IBacklogTaskPreview {
    if (!task) return null;
    const { id, name, status, dueDate, pic } = task;
    return {
      id,
      name,
      status,
      dueDate,
      pic: this.memberService._transform(pic),
    };
  }

  public _transform(task: BacklogTask): IBacklogTaskResponse {
    const preview = this._transformPreview(task);
    if (!preview) return null;

    return {
      ...preview,
      logs: this._transformMultiLogs(task.logs),
    };
  }

  public _transformMulti(
    tasks: BacklogTask[],
  ): TTransformResult<IBacklogTaskResponse, IBacklogTaskPreview> {
    const res = {
      previews: [],
      data: [],
    };
    tasks?.forEach((task) => {
      res.data.push(this._transform(task));
      res.previews.push(this._transformPreview(task));
    });

    return res;
  }
}
