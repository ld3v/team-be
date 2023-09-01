// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { TaskLog } from '../entities';
import { ITaskLogRepository } from '../interfaces';

@Injectable()
export class TaskLogRepository
  extends AbstractRepository<TaskLog>
  implements ITaskLogRepository
{
  __query: SelectQueryBuilder<TaskLog>;
  constructor(@InjectRepository(TaskLog) _repository: Repository<TaskLog>) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.task', 'task')
      .leftJoinAndSelect('l.member', 'member')
      .leftJoinAndSelect('member.account', 'account');
  }

  public async getItems(taskId: string): Promise<TaskLog[]> {
    return await this.__query
      .andWhere('task.id = :taskId', { taskId })
      .getMany();
  }
}
