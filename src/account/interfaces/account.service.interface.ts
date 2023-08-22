import { Account } from 'src/app/datasource/entities/account.entity';
import { IAccountResponse, TAccountPreview } from './account.interface';
import { CreateAccountDTO } from '../dto/account.dto';

export const I_ACCOUNT_SERVICE = 'I-ACCOUNT-SERVICE';

export interface IAccountService {
  getByUsername(username: string): Promise<Account | null>;
  create(data: CreateAccountDTO): Promise<Account>;
  _transform(account: Account): IAccountResponse;
  _transformPreview(account: Account): TAccountPreview;
  _transformMulti(accounts: Account[]): {
    previews: TAccountPreview[];
    data: IAccountResponse[];
  };
}
