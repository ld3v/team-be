// Libs importing
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  AbstractRepository,
  TPaginationOptions,
  TPaginationResult,
  queryByKeywordAndPagination,
} from 'src/app/datasource/repositories';
import { SPGoogleEvent } from '../entities/sp-g-event.entity';
import {
  IGoogleEventRepository,
  TSearchEventsOptions,
} from '../interfaces/support.interface';
import { CreateSPGEventDTO } from 'src/public/dto/create-event.dto';
import { arrayToDic } from 'common/func/array-to-dic';
import * as moment from 'moment';

@Injectable()
export class SPGoogleEventRepository
  extends AbstractRepository<SPGoogleEvent>
  implements IGoogleEventRepository
{
  __query: SelectQueryBuilder<SPGoogleEvent>;
  constructor(
    @InjectRepository(SPGoogleEvent) _repository: Repository<SPGoogleEvent>,
  ) {
    super(_repository);
    this.__query = this._repository.createQueryBuilder('e');
  }

  public async getEvents(
    { isTodayOnly, ...opts }: TSearchEventsOptions,
    paginationOpts: TPaginationOptions,
  ): Promise<TPaginationResult<SPGoogleEvent>> {
    console.log(moment().toISOString(), moment().endOf('day').toISOString());
    const query = this.__query.andWhere(
      'e.startedAt BETWEEN :startTime AND :finishTime',
      {
        startTime: moment().toISOString(),
        finishTime: moment().endOf('day').toISOString(),
      },
    );
    const { items, total } = await queryByKeywordAndPagination<SPGoogleEvent>(
      isTodayOnly ? query : this.__query,
      opts,
      paginationOpts,
      'e.googleEventSummary LIKE :keyword OR e.googleEventDescription LIKE :keyword',
    );

    return {
      items,
      total,
    };
  }

  public async getByEventIds(
    ids: string[],
  ): Promise<{ items: SPGoogleEvent[]; notExisted: string[] }> {
    const items = await this.__query
      .andWhere('e.eventId IN (:...ids)', {
        ids: [...ids],
      })
      .getMany();
    if (items.length < ids.length) {
      const existedIds = items.map((item) => item.eventId);
      const notExisted = ids.filter((id) => !existedIds.includes(id));

      return {
        items,
        notExisted,
      };
    }
    return { items, notExisted: [] };
  }

  public async createEvents(
    inputs: CreateSPGEventDTO[],
  ): Promise<SPGoogleEvent[]> {
    const items = inputs.map(
      ({
        id,
        recurringId,
        summary,
        description,
        meetingLink,
        startedAt,
        finishedAt,
        attendees,
      }) =>
        this._repository.create({
          eventId: id,
          eventRecurringId: recurringId,
          summary,
          description,
          meetingLink,
          startedAt: new Date(startedAt).toISOString(),
          finishedAt: new Date(finishedAt).toISOString(),
          members: JSON.stringify(attendees.map((a) => a.email)),
        }),
    );

    return await this._repository.save(items);
  }

  public async createEventsIfNotExist(
    inputs: CreateSPGEventDTO[],
  ): Promise<{ created: SPGoogleEvent[]; existed: SPGoogleEvent[] }> {
    const { ids, dic: inputDic } = arrayToDic(inputs);
    const { items: existed, notExisted } = await this.getByEventIds(ids);
    if (notExisted.length === 0) {
      Logger.log('No events need to create!');
      return { created: [], existed };
    }

    const eventNeedCreate = notExisted.map((id) => inputDic[id]);
    const items = await this.createEvents(eventNeedCreate);
    return {
      created: items,
      existed,
    };
  }
}
