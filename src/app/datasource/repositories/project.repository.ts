// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { Project } from '../entities';
import { IProjectRepository } from '../interfaces';

@Injectable()
export class ProjectRepository
  extends AbstractRepository<Project>
  implements IProjectRepository
{
  __query: SelectQueryBuilder<Project>;
  constructor(@InjectRepository(Project) _repository: Repository<Project>) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.program', 'program')
      .leftJoinAndSelect('p.iterations', 'iteration')
      .leftJoinAndSelect('p.members', 'member')
      .leftJoinAndSelect('p.backlog', 'backlog');
  }

  public async getProjects(
    programId: string,
    { keyword }: TSearchOptions = {},
    { page, size }: TPaginationOptions = {},
  ) {
    let _query = this.__query.andWhere('program.id = :programId', {
      programId,
    });

    if (keyword) {
      _query = _query.andWhere(
        '( p.name LIKE :keyword OR p.description LIKE :keyword )',
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

  public async getByBacklogId(backlogId: string): Promise<Project> {
    return await this.__query
      .andWhere('backlog.id = :backlogId', { backlogId })
      .getOne();
  }

  public async getByIterationId(iterationId: string): Promise<Project> {
    return await this.__query
      .andWhere('iteration.id = :iterationId', { iterationId })
      .getOne();
  }

  public async findById(id: string): Promise<Project> {
    return await this.__query.andWhere('p.id = :id', { id }).getOne();
  }
}
