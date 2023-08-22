// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories/abstract.repository';
import { Repository } from 'typeorm';
import { Program } from '../entities/program.entity';
import { IProgramRepository } from '../interfaces/program.interface';
import { Account } from '../entities';

@Injectable()
export class ProgramRepository
  extends AbstractRepository<Program>
  implements IProgramRepository
{
  constructor(@InjectRepository(Program) _repository: Repository<Program>) {
    super(_repository);
  }

  async getPrograms(
    { keyword }: TSearchOptions = {},
    { page, size }: TPaginationOptions = {},
    requester: Account,
  ) {
    let _query = this._repository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.projects', 'project')
      .leftJoinAndSelect('program.members', 'member')
      .leftJoinAndSelect('program.participants', 'participant')
      .where('member.id = :accountId OR participant.id = :accountId', {
        accountId: requester.id,
      });

    if (keyword) {
      _query = _query.where(
        'program.name LIKE :keyword OR program.description LIKE :keyword',
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

  public async getProgramById(
    id: string,
    requester: Account,
  ): Promise<Program> {
    return await this._repository
      .createQueryBuilder('program')
      .leftJoinAndSelect('program.projects', 'project')
      .leftJoinAndSelect('program.members', 'member')
      .leftJoinAndSelect('program.participants', 'participant')
      .where('program.id = :id', { id })
      .andWhere('member.id = :accountId OR participant.id = :accountId', {
        accountId: requester.id,
      })
      .getOne();
  }
}
