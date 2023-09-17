import { Inject, Controller, Post, Get, Query, Body } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateSPGEventsDTO } from './dto';
import { ISupportService, I_SUPPORT_SERVICE } from './interfaces';
import { CACHE_HOSTED_HISTORY, CACHE_HOSTED_TTL } from 'common/constants';

@Controller('support')
export class PublicController {
  constructor(
    @Inject(I_SUPPORT_SERVICE) private readonly supportService: ISupportService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @Post('g-events/passive-sync')
  public async syncGEvents(
    @Query('apiKey') apiKey: string,
    @Body() { events }: CreateSPGEventsDTO,
  ) {
    console.log(apiKey, events);
    return await this.supportService.createEventsIfNotExist(events);
  }

  @Get('cache/reset')
  public async clearCached() {
    return await this.cacheService.reset();
  }

  @Get('cache')
  public async getCached() {
    const membersCached = await this.cacheService.get(CACHE_HOSTED_HISTORY);
    const members = membersCached
      ? JSON.parse(membersCached as string)
      : undefined;
    if (!membersCached || !Array.isArray(members)) {
      await this.cacheService.set(CACHE_HOSTED_HISTORY, '[]', CACHE_HOSTED_TTL);
      return [];
    }
    return { members };
  }
}
