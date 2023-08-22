// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { BacklogTask, ProjectMember } from '../entities';
import { IBacklogTaskRepository } from '../interfaces';

@Injectable()
export class BacklogTaskRepository
  extends AbstractRepository<BacklogTask>
  implements IBacklogTaskRepository
{
  _getQuery: (memberId: string) => SelectQueryBuilder<BacklogTask>;
  constructor(
    @InjectRepository(BacklogTask) _repository: Repository<BacklogTask>,
  ) {
    super(_repository);
    this._getQuery = (memberId) =>
      this._repository
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.backlog', 'backlog')
        .leftJoinAndSelect('backlog.project', 'project')
        .leftJoinAndSelect('backlog.iteration', 'iteration')
        .leftJoinAndSelect('project.members', 'member')
        .andWhere('member.id = :memberId', { memberId });
  }

  public async getItems(
    backlogId: string,
    requester: ProjectMember,
  ): Promise<BacklogTask[]> {
    return await this._getQuery(requester.id)
      .andWhere('backlog.id = :backlogId', { backlogId })
      .getMany();
  }

  public async getItemById(
    id: string,
    requester: ProjectMember,
  ): Promise<BacklogTask> {
    return await this._getQuery(requester.id)
      .andWhere('t.id = :id', { id })
      .getOne();
  }
}
