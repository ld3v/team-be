import { TEntityOptionFields } from '.';
import { Iteration } from '../entities';
import { IRepository } from '../repositories';

export type TIterationEntity = Omit<Iteration, TEntityOptionFields>;

export const I_ITERATION_REPOSITORY = 'I-ITERATION-REPOSITORY';

export interface IIterationRepository extends IRepository<Iteration> {
  getItemsByProjectId(projectId: string): Promise<Iteration[]>;
  getCurrent(projectId: string): Promise<Iteration | null>;
}
