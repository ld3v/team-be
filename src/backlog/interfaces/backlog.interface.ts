import { Project } from 'src/app/datasource/entities';
import { TBacklogItemEntity } from 'src/app/datasource/interfaces';

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
