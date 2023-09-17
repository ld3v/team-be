import { Injectable, Inject } from '@nestjs/common';
import { ISupportService } from './interfaces';
import { SPGoogleEvent } from 'src/app/datasource/entities';
import { CreateSPGEventDTO } from './dto';
import {
  IGoogleEventRepository,
  I_SP_GOOGLE_EVENT_REPOSITORY,
} from 'src/app/datasource/interfaces';

@Injectable()
export class SupportService implements ISupportService {
  constructor(
    @Inject(I_SP_GOOGLE_EVENT_REPOSITORY)
    private readonly googleEventRepository: IGoogleEventRepository,
  ) {}

  public async createEventsIfNotExist(
    inputs: CreateSPGEventDTO[],
  ): Promise<SPGoogleEvent[]> {
    const { created } = await this.googleEventRepository.createEventsIfNotExist(
      inputs,
    );

    return created;
  }

  public async getEventsToday(): Promise<SPGoogleEvent[]> {
    const { items } = await this.googleEventRepository.getEvents({
      isTodayOnly: true,
    });

    return items;
  }
}
