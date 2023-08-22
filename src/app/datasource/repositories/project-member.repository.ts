// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { Account, ProjectMember } from '../entities';
import { IProjectMemberRepository } from '../interfaces';

@Injectable()
export class ProjectMemberRepository
  extends AbstractRepository<ProjectMember>
  implements IProjectMemberRepository
{
  _getQuery: (
    accountId: string,
    _forRead?: boolean,
  ) => SelectQueryBuilder<ProjectMember>;
  constructor(
    @InjectRepository(ProjectMember) _repository: Repository<ProjectMember>,
  ) {
    super(_repository);
    this._getQuery = (accountId, _forRead = true) =>
      this._repository
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.project', 'project')
        .leftJoinAndSelect('project.program', 'program')
        .leftJoinAndSelect('program.members', 'programMember')
        .andWhere(
          'programMember.id = :accountId' + _forRead
            ? ' OR programParticipant.id = :accountId'
            : '',
          { accountId },
        );
  }

  public async getMembers(
    projectId: string,
    requester: Account,
  ): Promise<ProjectMember[]> {
    return await this._getQuery(requester.id)
      .andWhere('project.id = :projectId', { projectId })
      .getMany();
  }

  public async getMemberById(
    id: string,
    requester: Account,
  ): Promise<ProjectMember> {
    return await this._getQuery(requester.id)
      .andWhere('m.id = :id', { id })
      .getOne();
  }

  public async getMemberByAccount(
    projectId: string,
    requester: Account,
  ): Promise<ProjectMember> {
    return await this._getQuery(requester.id, false)
      .andWhere('project.id = :projectId', { projectId })
      .getOne();
  }
}
