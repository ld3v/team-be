import { Inject, Controller, Post, Query, Body } from '@nestjs/common';
import { CreateSPGEventsDTO } from './dto';
import { IIntegrateService, I_INTEGRATE_SERVICE } from './interfaces';

@Controller('integrate')
export class IntegrateController {
  constructor(
    @Inject(I_INTEGRATE_SERVICE)
    private readonly integrateService: IIntegrateService,
  ) {}

  @Post('g-events/passive-sync')
  public async syncGEvents(
    @Query('apiKey') apiKey: string,
    @Body() { events }: CreateSPGEventsDTO,
  ) {
    return await this.integrateService.createEventsIfNotExist(events);
  }
}
