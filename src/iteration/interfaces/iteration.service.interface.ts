import { Account, Iteration } from 'src/app/datasource/entities';
import {
  ICreateIterationInput,
  IIterationResponse,
  TIterationPreview,
} from './iteration.interface';
import { TTransformResult } from 'src/app/interfaces/transform';

export const I_ITERATION_SERVICE = 'I-ITERATION-SERVICE';

export interface IIterationService {
  create(data: ICreateIterationInput, requester: Account): Promise<Iteration>;
  search(projectId: string, requester: Account): Promise<Iteration[]>;
  getById(id: string, requester: Account): Promise<Iteration | null>;
  _transform(iteration: Iteration): IIterationResponse;
  _transformPreview(iteration: Iteration): TIterationPreview;
  _transformMulti(
    iterations: Iteration[],
  ): TTransformResult<IIterationResponse, TIterationPreview>;
}
