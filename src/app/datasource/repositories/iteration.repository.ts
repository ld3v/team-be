// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { Iteration, ProjectMember } from '../entities';
import { IIterationRepository } from '../interfaces';

@Injectable()
export class IterationRepository
  extends AbstractRepository<Iteration>
  implements IIterationRepository
{
  _getQuery: (memberId: string) => SelectQueryBuilder<Iteration>;
  constructor(@InjectRepository(Iteration) _repository: Repository<Iteration>) {
    super(_repository);
    this._getQuery = (memberId) =>
      this._repository
        .createQueryBuilder('iteration')
        .leftJoinAndSelect('iteration.project', 'project')
        .leftJoinAndSelect('project.members', 'projectMember')
        .andWhere('projectMember.id = :memberId', { memberId });
  }

  public async getIterations(requester: ProjectMember) {
    return await this._getQuery(requester.id).getMany();
  }

  public async getIterationById(
    id: string,
    requester: ProjectMember,
  ): Promise<Iteration> {
    return await this._getQuery(requester.id)
      .andWhere('iteration.id = :id', { id })
      .getOne();
  }
}
