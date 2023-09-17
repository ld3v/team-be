import { SPGoogleEvent } from 'src/app/datasource/entities';
import { CreateSPGEventDTO } from '../dto';

export const I_SUPPORT_SERVICE = 'I-SUPPORT-SERVICE';
export interface ISupportService {
  createEventsIfNotExist(inputs: CreateSPGEventDTO[]): Promise<SPGoogleEvent[]>;
}
