import { Account } from 'src/app/datasource/entities';

export interface IAuthTokenPayload {
  username: string;
}

export interface IRequestWithAccount {
  user: Account;
}
