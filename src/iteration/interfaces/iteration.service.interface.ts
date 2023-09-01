import { Iteration, Project } from 'src/app/datasource/entities';
import {
  ICreateIterationInput,
  IIterationResponse,
  IIterationPreview,
} from './iteration.interface';
import { TTransformResult } from 'src/app/interfaces/transform';

export const I_ITERATION_SERVICE = 'I-ITERATION-SERVICE';

export interface IIterationService {
  create(data: ICreateIterationInput): Promise<Iteration>;
  getById(id: string): Promise<Iteration | null>;
  getCurrentByProjectId(projectId: string): Promise<Iteration | null>;
  findByProject(project: Project): Promise<Iteration[]>;

  _transform(iteration: Iteration): IIterationResponse;
  _transformPreview(iteration: Iteration): IIterationPreview;
  _transformMulti(
    iterations: Iteration[],
  ): TTransformResult<IIterationResponse, IIterationPreview>;
}
