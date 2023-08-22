import { TProjectEntity } from 'src/app/datasource/interfaces';

export interface IProjectResponse extends Omit<TProjectEntity, 'program'> {
  programId: string;
}

export type TProjectPreview = Pick<TProjectEntity, 'id' | 'name'>;
