import {
  IRepository,
  TPaginationOptions,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { Account } from '../entities';
import { TEntityOptionFields } from '.';

export type TAccountEntity = Omit<Account, TEntityOptionFields>;

export const I_ACCOUNT_REPOSITORY = 'I-ACCOUNT-REPOSITORY';

export interface IAccountRepository extends IRepository<Account> {
  getAccounts(
    searchOptions: TSearchOptions,
    pagination: TPaginationOptions,
  ): Promise<{ data: Account[]; total: number }>;

  getByUsername(username: string): Promise<Account | null>;
}
