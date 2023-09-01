// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { Account, Member } from '../entities';
import { IMemberRepository } from '../interfaces';

@Injectable()
export class MemberRepository
  extends AbstractRepository<Member>
  implements IMemberRepository
{
  __query: SelectQueryBuilder<Member>;
  constructor(@InjectRepository(Member) _repository: Repository<Member>) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.account', 'account')
      .leftJoinAndSelect('m.project', 'project')
      .leftJoinAndSelect('m.workloads', 'workload');
  }

  public async getMembersByProjectId(projectId: string): Promise<Member[]> {
    return await this.__query
      .andWhere('project.id = :projectId', { projectId })
      .getMany();
  }

  public async getMemberByAccount(
    projectId: string,
    requester: Account,
  ): Promise<Member> {
    return await this.__query
      .andWhere('project.id = :projectId', { projectId })
      .andWhere('account.id = :accountId', { accountId: requester.id })
      .getOne();
  }
}
