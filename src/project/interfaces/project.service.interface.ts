import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
  TProjectEntity,
  Account,
  Project,
} from '@ld3v/nqh-shared';
import { CreateProjectDTO } from '../dto';
import { IIterationPreview } from 'src/iteration/interfaces';
import { IMemberResponse } from '../../member/interfaces/member.service.interface';

export const I_PROJECT_SERVICE = 'I-PROJECT-SERVICE';

export type TProjectPreview = Pick<TProjectEntity, 'id' | 'name'>;

export type TAccessibleAs = 'project' | 'iteration' | 'backlog';

export type TProjectResponse = Pick<
  TProjectEntity,
  'id' | 'name' | 'description' | 'createdAt'
> & {
  iterations: IIterationPreview[];
  members: IMemberResponse[];
};

export interface IProjectService {
  create(data: CreateProjectDTO, requester: Account): Promise<Project>;
  search(
    programId: string,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Project>>;
  getById(
    id: string,
    requester?: Account,
    throwErrIfNotFound?: boolean,
  ): Promise<Project | null>;
  isAccessible(
    id: string,
    requester: Account,
    as?: TAccessibleAs,
  ): Promise<Project>;
  // Transform data
  _transform(project: Project): TProjectResponse;
  _transformPreview(project: Project): TProjectPreview;
  _transformMulti(projects: Project[]): {
    previews: TProjectPreview[];
    data: TProjectResponse[];
  };
}
