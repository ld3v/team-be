import {
  IRepository,
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { TEntityOptionFields } from '.';
import { Account, Program } from '../entities';

export type TProgramEntity = Omit<Program, TEntityOptionFields>;

export const I_PROGRAM_REPOSITORY = 'I-PROGRAM-REPOSITORY';

export interface IProgramRepository extends IRepository<Program> {
  getPrograms(
    searchOptions: TSearchOptions,
    pagination: TPaginationOptions,
    requester: Account,
  ): Promise<TPaginationResult<Program>>;
  getProgramById(id: string, requester: Account): Promise<Program>;
}
