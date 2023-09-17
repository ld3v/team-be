import { Inject, Controller, Post, Query, Body } from '@nestjs/common';
import { CreateSPGEventsDTO } from './dto';
import { ISupportService, I_SUPPORT_SERVICE } from './interfaces';

@Controller('support')
export class PublicController {
  constructor(
    @Inject(I_SUPPORT_SERVICE) private readonly supportService: ISupportService,
  ) {}

  @Post('g-events/passive-sync')
  public async syncGEvents(
    @Query('apiKey') apiKey: string,
    @Body() { events }: CreateSPGEventsDTO,
  ) {
    console.log(apiKey);
    await this.supportService.createEventsIfNotExist(events);

    return events;
  }
}
