import { Account, AppIntegrated, EAppIntegrate } from '@ld3v/nqh-shared';
import { TAppIntegratedResponse } from '.';

export const I_INTEGRATE_SERVICE = 'I-INTEGRATE-SERVICE';

export interface ICreateAppData {
  id?: string;
  name: string;
  description?: string;
  app: EAppIntegrate;
  privateKey: string;
}
export interface IIntegrateService {
  getMyApps(requester: Account): Promise<AppIntegrated[]>;
  create(data: ICreateAppData, requester: Account): Promise<AppIntegrated>;
  validate(name: string, apiKey: string): Promise<AppIntegrated>;
  deleteById(id: string): Promise<boolean>;
  transform(item: AppIntegrated): TAppIntegratedResponse;
  transformMulti(items: AppIntegrated[]): TAppIntegratedResponse[];
}
