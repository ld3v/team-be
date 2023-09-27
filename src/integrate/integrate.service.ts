import {
  Injectable,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ICreateAppData,
  IIntegrateService,
  TAppIntegratedResponse,
} from './interfaces';
import {
  Account,
  AppIntegrated,
  IAppIntegratedRepository,
  I_APP_INTEGRATED_REPOSITORY,
} from '@ld3v/nqh-shared';
import { validateAppKeys } from 'common/func';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import MESSAGES from 'common/messages';

@Injectable()
export class IntegrateService implements IIntegrateService {
  constructor(
    @Inject(I_ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
    @Inject(I_APP_INTEGRATED_REPOSITORY)
    private readonly appIntegratedRepository: IAppIntegratedRepository,
  ) {}

  async validate(id: string, apiKey: string): Promise<AppIntegrated> {
    if (!id || !apiKey) {
      throw new BadRequestException("Please provide 'appId' & 'APIKey'!");
    }
    const app = await this.appIntegratedRepository.findById(id);
    if (!app || !validateAppKeys(app.privateKey, apiKey)) {
      throw new ForbiddenException(
        "You don't have permission to do this action!",
      );
    }

    return app;
  }

  async getMyApps(requester: Account): Promise<AppIntegrated[]> {
    return await this.appIntegratedRepository.getMyApps(requester);
  }

  async create(
    { id, name, description, app, privateKey }: ICreateAppData,
    requester: Account,
  ): Promise<AppIntegrated> {
    console.log('123');
    return await this.appIntegratedRepository.create({
      id,
      name,
      description,
      app,
      privateKey,
      createdBy: requester,
    });
  }

  async deleteById(id: string): Promise<any> {
    const isDeleted = await this.appIntegratedRepository.deleteById(id);
    if (isDeleted === null) {
      throw new BadRequestException(MESSAGES.common.NOT_EXIST('integrate'));
    }

    return isDeleted;
  }

  transform(item: AppIntegrated): TAppIntegratedResponse {
    const data = {
      ...item,
      createdBy: this.accountService._transformPreview(item.createdBy),
    };
    delete data.privateKey;

    return data;
  }

  transformMulti(items: AppIntegrated[]): TAppIntegratedResponse[] {
    return items.map((item) => this.transform(item));
  }
}
