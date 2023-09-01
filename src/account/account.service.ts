import { Inject, Injectable } from '@nestjs/common';
import {
  IAccountService,
  IAccountResponse,
  TAccountPreview,
} from './interfaces';
import { Account } from 'src/app/datasource/entities/account.entity';

import {
  IAccountRepository,
  I_ACCOUNT_REPOSITORY,
} from 'src/app/datasource/interfaces/account.interface';
import { CreateAccountDTO } from './dto/account.dto';
import ServiceError from 'common/errors/service.error';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(I_ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
  ) {}

  public async getByUsername(username: string): Promise<Account> {
    try {
      return await this.accountRepository.getByUsername(username);
    } catch (error) {
      throw new ServiceError(error.message, AccountService.name);
    }
  }

  public async create(data: CreateAccountDTO): Promise<Account> {
    try {
      return await this.accountRepository.create(data);
    } catch (error) {
      throw new ServiceError(error.message, AccountService.name);
    }
  }

  public _transform(account: Account): IAccountResponse {
    const data = {
      ...account,
      memberOfProgramIds: (account.memberOfPrograms || []).map((p) => p.id),
      participantOfProgramIds: (account.participantOfPrograms || []).map(
        (p) => p.id,
      ),
    };
    delete data.password;
    delete data.memberOfPrograms;
    delete data.participantOfPrograms;

    return data;
  }

  public _transformPreview(account: Account): TAccountPreview {
    return {
      id: account.id,
      username: account.username,
      avatar: account.avatar,
      displayName: account.displayName,
    };
  }

  public _transformMulti(accounts: Account[]): {
    previews: TAccountPreview[];
    data: IAccountResponse[];
  } {
    const res = {
      previews: [],
      data: [],
    };
    accounts?.forEach((acc) => {
      res.data.push(this._transform(acc));
      res.previews.push(this._transformPreview(acc));
    });

    return res;
  }
}
