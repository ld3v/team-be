// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { Account, Project } from '../entities';
import { IProjectRepository } from '../interfaces';

@Injectable()
export class ProjectRepository
  extends AbstractRepository<Project>
  implements IProjectRepository
{
  constructor(@InjectRepository(Project) _repository: Repository<Project>) {
    super(_repository);
  }

  public async getProjects(
    programId: string,
    requester: Account,
    { keyword }: TSearchOptions = {},
    { page, size }: TPaginationOptions = {},
  ) {
    let _query = this._repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.program', 'program')
      .leftJoinAndSelect('program.members', 'programMember')
      .leftJoinAndSelect('program.participants', 'programParticipant')
      .andWhere('program.id = :programId', { programId })
      .andWhere(
        'programMember.id = :accountId OR programParticipant.id = :accountId',
        { accountId: requester.id },
      );

    if (keyword) {
      _query = _query.where(
        'project.name LIKE :keyword OR project.description LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }
    const total = await _query.getCount();
    if (page !== undefined || size) {
      _query = _query.offset((page || 0) * size).limit(size || 10);
    }

    const data = await _query.getMany();

    return {
      items: data,
      total,
    };
  }

  public async getProjectById(
    id: string,
    requester: Account,
  ): Promise<Project> {
    return await this._repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.program', 'program')
      .leftJoinAndSelect('program.members', 'programMember')
      .leftJoinAndSelect('program.participants', 'programParticipant')
      .andWhere('project.id = :id', { id })
      .andWhere(
        'programMember.id = :accountId OR programParticipant.id = :accountId',
        { accountId: requester.id },
      )
      .getOne();
  }
}
