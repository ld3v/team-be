import {
  Account,
  Iteration,
  Project,
  ProjectMember,
} from 'src/app/datasource/entities';
import { CreateProjectDTO } from '../dto';
import { IProjectResponse, TProjectPreview } from './project.interface';
import {
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from 'src/app/datasource/repositories';

export const I_PROJECT_SERVICE = 'I-PROJECT-SERVICE';

export interface IProjectService {
  create(data: CreateProjectDTO, requester: Account): Promise<Project>;
  search(
    programId: string,
    requester: Account,
    searchOptions: TSearchOptions,
    paginationOptions: TPaginationOptions,
  ): Promise<TPaginationResult<Project>>;
  getById(id: string, requester: Account): Promise<Project | null>;
  getMemberByAccount(
    projectId: string,
    requester: Account,
  ): Promise<ProjectMember | null>;
  getIterationsById(requester: ProjectMember): Promise<Iteration[]>;
  _transform(project: Project): IProjectResponse;
  _transformPreview(project: Project): TProjectPreview;
  _transformMulti(projects: Project[]): {
    previews: TProjectPreview[];
    data: IProjectResponse[];
  };
}
