import { TProjectPreview } from 'src/project/interfaces';
import { TEntityOptionFields } from '.';
import { Account, Workload, Project, Member } from '../entities';
import {
  IRepository,
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from '../repositories/abstract.repository';

export type TProjectEntity = Omit<Project, TEntityOptionFields>;
export type TProjectMemberEntity = Omit<Member, TEntityOptionFields>;
export type TWorkloadEntity = Omit<Workload, TEntityOptionFields>;

export const I_PROJECT_REPOSITORY = 'I-PROJECT-REPOSITORY';
export const I_MEMBER_REPOSITORY = 'I-MEMBER-REPOSITORY';
export const I_WORKLOAD_REPOSITORY = 'I-WORKLOAD-REPOSITORY';

export interface IProjectRepository extends IRepository<Project> {
  getProjects(
    programId: string,
    searchOptions: TSearchOptions,
    pagination: TPaginationOptions,
  ): Promise<TPaginationResult<Project>>;
  getByBacklogId(backlogId: string): Promise<Project>;
  getByIterationId(iterationId: string): Promise<Project>;
}

export interface IMemberRepository extends IRepository<Member> {
  getMembersByProjectId(projectId: string): Promise<Member[]>;
  getMemberByAccount(projectId: string, requester: Account): Promise<Member>;
}

export interface IWorkloadByUser {
  project: TProjectPreview;
  workload: {
    week: Workload['name'];
    load: Workload['load'];
  }[];
  memberId: string;
}
export interface IWorkloadRepository extends IRepository<Workload> {
  getWorkloads(
    projectId: string,
    memberId?: string,
  ): Promise<Record<string, IWorkloadByUser>>;
}
