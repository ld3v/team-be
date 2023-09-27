import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IIntegrateService } from '../integrate/interfaces';
import { gRPC } from '@ld3v/nqh-shared';
import { EMPTY, lastValueFrom } from 'rxjs';

type TGoogleEventServiceClient =
  gRPC.GoogleEventService.GoogleEventServiceClient;
type TEventResponse = gRPC.GoogleEventService.EventResponse;

@Injectable()
export class IntegrateService implements IIntegrateService {
  private googleEventMicroservice: TGoogleEventServiceClient;
  constructor(
    @Inject('GOOGLE_EVENT_CLIENT')
    private readonly googleEventClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.googleEventMicroservice =
      this.googleEventClient.getService<TGoogleEventServiceClient>(
        'GoogleEventService',
      );
  }

  public async createEventsIfNotExist(
    inputs: any[],
  ): Promise<TEventResponse[]> {
    const res = await lastValueFrom(
      this.googleEventMicroservice.createEvents({
        events: inputs.map((i) => ({
          ...i,
          description: i.description || '',
          eventLink: i.eventLink || '',
        })),
      }),
    );

    return res.events;
  }

  public async getEventsToday(): Promise<TEventResponse[]> {
    const res = await lastValueFrom(
      this.googleEventMicroservice.getEvents(EMPTY),
    );

    return res.events;
  }
}
