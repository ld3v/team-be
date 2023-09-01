// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories/abstract.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Account } from '../entities/account.entity';
import { IAccountRepository } from '../interfaces/account.interface';

@Injectable()
export class AccountRepository
  extends AbstractRepository<Account>
  implements IAccountRepository
{
  __query: SelectQueryBuilder<Account>;
  constructor(@InjectRepository(Account) _repository: Repository<Account>) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.memberOfPrograms', 'memOfPrg')
      .leftJoinAndSelect('account.participantOfPrograms', 'participantOfPrg');
  }

  public async getAccounts(
    { keyword }: TSearchOptions = {},
    { page, size }: TPaginationOptions = {},
  ) {
    let _query = this.__query;

    if (keyword) {
      _query = _query.andWhere(
        '( account.username LIKE :keyword OR account.displayName LIKE :keyword )',
        { keyword: `%${keyword}%` },
      );
    }
    const total = await _query.getCount();
    if (page !== undefined || size) {
      _query = _query.offset((page || 0) * size).limit(size || 10);
    }

    const data = await _query.getMany();

    return {
      data,
      total,
    };
  }

  public async getByUsername(username: string) {
    return await this.__query
      .andWhere('account.username = :username', {
        username,
      })
      .getOne();
  }
}
