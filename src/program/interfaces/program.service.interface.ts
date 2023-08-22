import { Account, Program } from 'src/app/datasource/entities';
import { CreateProgramDTO } from '../dto';
import { IProgramResponse, TProgramPreview } from './program.interface';
import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from 'src/app/datasource/repositories';
import { TTransformResult } from 'src/app/interfaces/transform';

export const I_PROGRAM_SERVICE = 'I-PROGRAM-SERVICE';

export interface IProgramService {
  create(data: CreateProgramDTO, author: Account): Promise<Program>;
  search(
    requester: Account,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Program>>;
  getById(id: string, requester: Account): Promise<Program | null>;
  _transform(program: Program): IProgramResponse;
  _transformPreview(program: Program): TProgramPreview;
  _transformMulti(
    programs: Program[],
  ): TTransformResult<IProgramResponse, TProgramPreview>;
}
