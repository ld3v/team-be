import { IAuthTokenPayload } from './auth.interface';

export const I_AUTH_SERVICE = 'I-AUTH-SERVICE';

export interface IAuthService {
  validate(password: string, encrypted: string): Promise<boolean>;
  generatePassword(password: string): Promise<string>;
  generateCookieString(
    _forLogout?: boolean,
    payload?: IAuthTokenPayload,
  ): string;
}
