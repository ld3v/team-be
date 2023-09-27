import { Project, TBacklogItemEntity } from '@ld3v/nqh-shared';

export interface ICreateBacklogItem {
  name: string;
  description?: string;
  project: Project;
}

export interface IBacklogResponse
  extends Omit<TBacklogItemEntity, '_updateId' | 'project'> {
  projectId: string;
}

export type TBacklogPreview = Pick<
  TBacklogItemEntity,
  'id' | 'name' | 'description' | 'status'
>;
