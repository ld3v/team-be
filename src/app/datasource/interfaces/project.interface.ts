import { TProjectPreview } from 'src/project/interfaces';
import { TEntityOptionFields } from '.';
import { Account, MemberWorkload, Project, ProjectMember } from '../entities';
import {
  IRepository,
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from '../repositories/abstract.repository';

export type TProjectEntity = Omit<Project, TEntityOptionFields>;
export type TProjectMemberEntity = Omit<ProjectMember, TEntityOptionFields>;
export type TWorkloadEntity = Omit<MemberWorkload, TEntityOptionFields>;

export const I_PROJECT_REPOSITORY = 'I-PROJECT-REPOSITORY';
export const I_PROJECT_MEMBER_REPOSITORY = 'I-PROJECT-MEMBER-REPOSITORY';
export const I_MEMBER_WORKLOAD_REPOSITORY = 'I-MEMBER-WORKLOAD-REPOSITORY';

export interface IProjectRepository extends IRepository<Project> {
  getProjects(
    programId: string,
    requester: Account,
    searchOptions: TSearchOptions,
    pagination: TPaginationOptions,
  ): Promise<TPaginationResult<Project>>;
  getProjectById(id: string, requester: Account): Promise<Project>;
}

export interface IProjectMemberRepository extends IRepository<ProjectMember> {
  getMembers(projectId: string, requester: Account): Promise<ProjectMember[]>;
  getMemberById(id: string, requester: Account): Promise<ProjectMember>;
  getMemberByAccount(
    projectId: string,
    requester: Account,
  ): Promise<ProjectMember>;
}

export interface IWorkloadByUser {
  project: TProjectPreview;
  workload: {
    week: MemberWorkload['name'];
    load: MemberWorkload['load'];
  }[];
  memberId: string;
}
export interface IWorkloadRepository extends IRepository<MemberWorkload> {
  getWorkloads(
    projectId: string,
    memberId?: string,
  ): Promise<Record<string, IWorkloadByUser>>;
}
