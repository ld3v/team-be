import { CreateSPGEventDTO } from '../dto';
import { OnModuleInit } from '@nestjs/common';
import { gRPC } from '@ld3v/nqh-shared';
type TEventResponse = gRPC.GoogleEventService.EventResponse;

export const I_INTEGRATE_SERVICE = 'I-INTEGRATE-SERVICE';
export interface IIntegrateService extends OnModuleInit {
  createEventsIfNotExist(
    inputs: CreateSPGEventDTO[],
  ): Promise<TEventResponse[]>;
  getEventsToday(): Promise<TEventResponse[]>;
}
