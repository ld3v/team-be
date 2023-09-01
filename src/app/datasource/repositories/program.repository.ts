// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Account, Program } from '../entities';
import { IProgramRepository } from '../interfaces';

@Injectable()
export class ProgramRepository
  extends AbstractRepository<Program>
  implements IProgramRepository
{
  __query: (accountId: string) => SelectQueryBuilder<Program>;
  constructor(@InjectRepository(Program) _repository: Repository<Program>) {
    super(_repository);
    this.__query = (accountId) => {
      const __query = this._repository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.projects', 'project')
        .leftJoinAndSelect('p.members', 'member')
        .leftJoinAndSelect('p.participants', 'participant');
      if (!accountId) return __query;
      return __query.andWhere(
        '( member.id = :accountId OR participant.id = :accountId )',
        {
          accountId,
        },
      );
    };
  }

  async getItems(
    { keyword }: TSearchOptions = {},
    { page, size }: TPaginationOptions = {},
    requester?: Account,
  ) {
    let _query = this.__query(requester?.id);
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

  public async getById(id: string, requester?: Account): Promise<Program> {
    return await this.__query(requester?.id)
      .andWhere('p.id = :id', { id })
      .getOne();
  }

  public async getByProjectId(
    projectId: string,
    requester?: Account,
  ): Promise<Program> {
    return await this.__query(requester?.id)
      .andWhere('project.id = :projectId', { projectId })
      .getOne();
  }
}
