import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthService } from './interfaces';
import ServiceError from 'common/errors/service.error';
import VALIDATE_MESSAGE from 'common/messages/validate';
import { ConfigService } from '@nestjs/config';
import { IAuthTokenPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async validate(password: string, encrypted: string): Promise<boolean> {
    if (!password || !encrypted) {
      throw new ServiceError(VALIDATE_MESSAGE.INPUT_INVALID, AuthService.name);
    }
    return await bcrypt.compare(password, encrypted);
  }

  public async generatePassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 15);
  }

  public generateCookieString(
    _forLogout = true,
    payload?: IAuthTokenPayload,
  ): string {
    if (!_forLogout && payload) {
      const token = this.jwtService.sign(payload);
      const expiresInDates = this.configService.get<number>(
        'JWT_EXPIRES_IN_DATES',
      );
      const expiresInSecs = 60 * 60 * 24 * expiresInDates;
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresInSecs}`;
    }
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
