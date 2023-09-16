import { Controller, Post, Query, Body } from '@nestjs/common';

@Controller('support')
export class PublicController {
  @Post('g-events/sync')
  public syncGEvents(
    @Query('apiKey') apiKey: string,
    @Body() { events }: { events: any[] },
  ) {
    console.log(events);

    return events;
  }
}
