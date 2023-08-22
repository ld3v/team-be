import { TIterationEntity } from 'src/app/datasource/interfaces';
import { CreateIterationDTO } from '../dto';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIterationResponse
  extends Omit<TIterationEntity, '_updateId' | 'project'> {
  projectId: string;
}

export type TIterationPreview = Pick<
  TIterationEntity,
  'id' | 'name' | 'description' | 'isClosed'
>;

export interface ICreateIterationInput
  extends Omit<CreateIterationDTO, 'startAt' | 'finishAt'> {
  startAt: Date;
  finishAt: Date;
}
