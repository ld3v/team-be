import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/account/account.service';
import { IAuthTokenPayload } from '../interfaces';
import { I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import MESSAGES from 'common/messages';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(I_ACCOUNT_SERVICE)
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IAuthTokenPayload) {
    const { username } = payload;
    const account = await this.accountService.getByUsername(username);
    if (!account) {
      throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
    }
    // Logger.log(username, account.username);
    return account;
  }
}
