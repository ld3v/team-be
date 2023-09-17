import { CreateSPGEventDTO } from 'src/public/dto/create-event.dto';
import { SPGoogleEvent } from '../entities/sp-g-event.entity';
import {
  IRepository,
  TPaginationOptions,
  TPaginationResult,
  TSearchOptions,
} from '../repositories';

export const I_SP_GOOGLE_EVENT_REPOSITORY = 'I-SP-GOOGLE-EVENT-REPOSITORY';
export interface IGoogleEventRepository extends IRepository<SPGoogleEvent> {
  getEvents(
    searchOptions: TSearchOptions,
    pagination: TPaginationOptions,
  ): Promise<TPaginationResult<SPGoogleEvent>>;
  createEvents(inputs: CreateSPGEventDTO[]): Promise<SPGoogleEvent[]>;
  createEventsIfNotExist(inputs: CreateSPGEventDTO[]): Promise<{
    created: SPGoogleEvent[];
    existed: SPGoogleEvent[];
  }>;
  getByEventIds(
    ids: string[],
  ): Promise<{ items: SPGoogleEvent[]; notExisted: string[] }>;
}
