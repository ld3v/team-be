import { TIterationEntity, TTimeRange } from 'src/app/datasource/interfaces';
import { CreateIterationDTO } from '../dto';
import { Project } from 'src/app/datasource/entities';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIterationResponse
  extends Omit<TIterationEntity, '_updateId' | 'project'> {
  projectId: string;
}

export interface IIterationPreview
  extends Pick<TIterationEntity, 'id' | 'name' | 'description' | 'isClosed'> {
  dates: TTimeRange;
}

export interface ICreateIterationInput
  extends Omit<CreateIterationDTO, 'startAt' | 'finishAt' | 'projectId'> {
  project: Project;
  startAt: Date;
  finishAt: Date;
}
