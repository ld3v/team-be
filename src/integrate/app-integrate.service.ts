import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IAppIntegrateService } from './interfaces';
import { gRPC } from '@ld3v/nqh-shared';
import { EMPTY, lastValueFrom } from 'rxjs';

type TGoogleEventServiceClient = gRPC.GoogleEvent.GoogleEventServiceClient;
type TEventResponse = gRPC.GoogleEvent.EventResponse;
type TTriggerRequest = gRPC.GoogleEvent.TriggerRequest;

@Injectable()
export class AppIntegrateService implements IAppIntegrateService {
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

  public async triggerDS({
    isIncludeHosted,
    env,
  }: TTriggerRequest): Promise<boolean> {
    const res = await lastValueFrom(
      this.googleEventMicroservice.triggerDs({
        isIncludeHosted,
        env,
      }),
    );
    return res.isSuccessed;
  }

  public async getHosted(): Promise<string[]> {
    const res = await lastValueFrom(
      this.googleEventMicroservice.getMembers(EMPTY),
    );

    return res.members;
  }
}
