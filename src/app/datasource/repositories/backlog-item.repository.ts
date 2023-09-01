// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { BacklogItem } from '../entities';
import { IBacklogItemRepository } from '../interfaces';

@Injectable()
export class BacklogItemRepository
  extends AbstractRepository<BacklogItem>
  implements IBacklogItemRepository
{
  __query: SelectQueryBuilder<BacklogItem>;
  constructor(
    @InjectRepository(BacklogItem) _repository: Repository<BacklogItem>,
  ) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.tasks', 'task')
      .leftJoinAndSelect('task.logs', 'log')
      .leftJoinAndSelect('b.project', 'project')
      .leftJoinAndSelect('b.iteration', 'iteration')
      .orderBy('b.priority', 'ASC');
  }

  public async getItems(
    projectId: string,
    iterationId?: string,
  ): Promise<BacklogItem[]> {
    let _query = this.__query.andWhere('project.id = :projectId', {
      projectId,
    });
    if (iterationId) {
      _query = _query.andWhere('iteration.id = :iterationId', { iterationId });
    }
    _query = _query
      .addSelect('SUM(log.timeSpent)', 'totalTimeSpent')
      .groupBy('b.id');

    const data = await _query.getRawMany();

    return data;
  }

  public async findById(id: string): Promise<BacklogItem> {
    return await this.__query.andWhere('b.id = :id', { id }).getOne();
  }
}
