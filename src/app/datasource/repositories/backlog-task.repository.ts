// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { BacklogTask, TaskLog } from '../entities';
import { IBacklogTaskRepository } from '../interfaces';

@Injectable()
export class BacklogTaskRepository
  extends AbstractRepository<BacklogTask>
  implements IBacklogTaskRepository
{
  __query: SelectQueryBuilder<BacklogTask>;
  constructor(
    @InjectRepository(BacklogTask) _repository: Repository<BacklogTask>,
  ) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.backlog', 'backlog')
      .leftJoinAndSelect('t.pic', 'pic')
      .leftJoinAndSelect('pic.account', 'account');
  }

  public async getItems(backlogId: string): Promise<BacklogTask[]> {
    return await this.__query
      .andWhere('backlog.id = :backlogId', { backlogId })
      .getMany();
  }

  public async findById(
    id: string,
  ): Promise<BacklogTask & { totalTimeSpent: number }> {
    return (await this.__query
      .leftJoinAndSelect('t.logworks', 'logwork')
      .addSelect('SUM(logwork.timeSpent)', 'totalTimeSpent')
      .andWhere('t.id = :id', { id })
      .getRawOne()) as BacklogTask & { totalTimeSpent: number };
  }

  public async addLog(
    task: BacklogTask,
    logwork: TaskLog,
  ): Promise<BacklogTask> {
    task.logs.push(logwork);
    return await this._repository.save(task);
  }
}
