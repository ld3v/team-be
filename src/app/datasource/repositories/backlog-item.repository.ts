// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { BacklogItem, ProjectMember } from '../entities';
import { IBacklogItemRepository } from '../interfaces';

@Injectable()
export class BacklogItemRepository
  extends AbstractRepository<BacklogItem>
  implements IBacklogItemRepository
{
  _getQuery: (memberId: string) => SelectQueryBuilder<BacklogItem>;
  constructor(
    @InjectRepository(BacklogItem) _repository: Repository<BacklogItem>,
  ) {
    super(_repository);
    this._getQuery = (memberId) =>
      this._repository
        .createQueryBuilder('b')
        .leftJoinAndSelect('b.project', 'project')
        .leftJoinAndSelect('b.iteration', 'iteration')
        .leftJoinAndSelect('project.members', 'member')
        .andWhere('member.id = :memberId', { memberId });
  }

  public async getItems(
    projectId: string,
    requester: ProjectMember,
    iterationId?: string,
  ): Promise<BacklogItem[]> {
    let _query = this._getQuery(requester.id).andWhere(
      'project.id = :projectId',
      { projectId },
    );
    if (iterationId) {
      _query = _query.andWhere('iteration.id = :iterationId', { iterationId });
    }

    const data = await _query.getMany();

    return data;
  }

  public async getItemById(
    id: string,
    requester: ProjectMember,
  ): Promise<BacklogItem> {
    return await this._getQuery(requester.id)
      .andWhere('b.id = :id', { id })
      .getOne();
  }
}
