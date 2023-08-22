import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IAuthService, I_AUTH_SERVICE } from '../interfaces';
import {
  IAccountService,
  I_ACCOUNT_SERVICE,
  IAccountResponse,
} from 'src/account/interfaces';
import MESSAGES from 'common/messages';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(I_ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
    @Inject(I_AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {
    super({
      usernameField: 'username',
    });
  }
  async validate(
    username: string,
    password: string,
  ): Promise<IAccountResponse> {
    const account = await this.accountService.getByUsername(username);
    if (!account) {
      throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
    }
    const isValid = await this.authService.validate(password, account.password);
    if (!isValid) {
      throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
    }
    return this.accountService._transform(account);
  }
}
