// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { Iteration } from '../entities';
import { IIterationRepository } from '../interfaces';

@Injectable()
export class IterationRepository
  extends AbstractRepository<Iteration>
  implements IIterationRepository
{
  _query: SelectQueryBuilder<Iteration>;
  constructor(@InjectRepository(Iteration) _repository: Repository<Iteration>) {
    super(_repository);
    this._query = this._repository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.project', 'project')
      .leftJoinAndSelect('project.program', 'program')
      .leftJoinAndSelect('i.backlog', 'backlog')
      .orderBy('backlog.priority', 'ASC')
      .orderBy('i.startAt', 'DESC');
  }

  public async getItemsByProjectId(projectId: string) {
    return await this._query
      .andWhere('project.id = :projectId', { projectId })
      .getMany();
  }

  public async getCurrent(projectId: string): Promise<Iteration> {
    return await this._query
      .andWhere('project.id = :projectId', { projectId })
      .andWhere('i.isClosed = :isClosed', { isClosed: false })
      .getOne();
  }

  public async findById(id: string): Promise<Iteration> {
    return await this._query.andWhere('iteration.id = :id', { id }).getOne();
  }
}
