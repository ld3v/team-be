import { TEntityOptionFields } from '.';
import { Iteration, ProjectMember } from '../entities';
import { IRepository } from '../repositories';

export type TIterationEntity = Omit<Iteration, TEntityOptionFields>;

export const I_ITERATION_REPOSITORY = 'I-ITERATION-REPOSITORY';

export interface IIterationRepository extends IRepository<Iteration> {
  getIterations(projectMember: ProjectMember): Promise<Iteration[]>;
  getIterationById(
    id: string,
    requester: ProjectMember,
  ): Promise<Iteration | null>;
}
