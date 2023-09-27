import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
  Account,
  Program,
} from '@ld3v/nqh-shared';
import { CreateProgramDTO } from '../dto';
import { IProgramResponse, TProgramPreview } from './program.interface';
import { TTransformResult } from 'src/app/interfaces/transform';

export const I_PROGRAM_SERVICE = 'I-PROGRAM-SERVICE';

export interface IProgramService {
  create(data: CreateProgramDTO, author: Account): Promise<Program>;
  search(
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
    requester: Account,
  ): Promise<TPaginationResult<Program>>;
  /**
   * Set `throwErrIfNotFound` to `true` -> throw Error if not found
   */
  getById(
    id: string,
    requester?: Account,
    throwErrIfNotFound?: boolean,
  ): Promise<Program | null>;
  getByProjectId(
    projectId: string,
    requester: Account,
  ): Promise<Program | null>;
  // Transform data
  _transform(program: Program): IProgramResponse;
  _transformPreview(program: Program): TProgramPreview;
  _transformMulti(
    programs: Program[],
  ): TTransformResult<IProgramResponse, TProgramPreview>;
}
