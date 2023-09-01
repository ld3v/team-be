// Libs importing
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AbstractRepository } from 'src/app/datasource/repositories';
import { Workload } from '../entities';
import { IWorkloadByUser, IWorkloadRepository } from '../interfaces';

@Injectable()
export class WorkloadRepository
  extends AbstractRepository<Workload>
  implements IWorkloadRepository
{
  __query: SelectQueryBuilder<Workload>;
  constructor(@InjectRepository(Workload) _repository: Repository<Workload>) {
    super(_repository);
    this.__query = this._repository
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.project', 'project')
      .leftJoinAndSelect('w.member', 'member');
  }

  public async getWorkloads(
    projectId: string,
    memberId?: string,
  ): Promise<Record<string, IWorkloadByUser>> {
    let _query = this.__query.andWhere('project.id = :projectId', {
      projectId,
    });
    if (memberId) {
      _query = _query.andWhere('member.id = :memberId', { memberId });
    }
    const workloads = await _query.getRawMany<Workload>();

    const res: Record<string, IWorkloadByUser> = {};
    workloads.forEach((wl) => {
      if (!res[wl.member.account.username]) {
        res[wl.member.account.username] = {
          memberId: wl.member.id,
          workload: [
            {
              load: wl.load,
              week: wl.name,
            },
          ],
          project: {
            id: wl.project.id,
            name: wl.project.name,
          },
        };
        return;
      }
      res[wl.member.account.username].workload.push({
        load: wl.load,
        week: wl.name,
      });
    });

    return res;
  }
}
