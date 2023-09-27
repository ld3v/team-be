import { Account } from '@ld3v/nqh-shared';

export interface IAuthTokenPayload {
  username: string;
}

export interface IRequestWithAccount {
  user: Account;
}
