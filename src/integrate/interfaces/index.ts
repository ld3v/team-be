import { TAppIntegratedEntity } from '@ld3v/nqh-shared';
import { TAccountPreview } from 'src/account/interfaces';

export * from './app-integrate.service.interface';
export * from './integrate.service.interface';

export type TAppIntegratedResponse = Omit<
  TAppIntegratedEntity,
  'privateKey' | 'createdBy'
> & {
  createdBy: TAccountPreview;
};
