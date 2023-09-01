import {
  Inject,
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  BadRequestException,
  Get,
} from '@nestjs/common';
import {
  IAuthService,
  I_AUTH_SERVICE,
} from './interfaces/auth.service.interface';
import { LocalAuthGuard } from './guards';
import { IRequestWithAccount } from './interfaces';
import ResponseObject from 'common/response';
import { Response } from 'express';
import { IAccountService, I_ACCOUNT_SERVICE } from 'src/account/interfaces';
import { CreateAccountDTO } from 'src/account/dto/account.dto';
import MESSAGES from 'common/messages';
import { CookieStrategy } from './strategies';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(I_AUTH_SERVICE)
    private readonly authService: IAuthService,
    @Inject(I_ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() { user }: IRequestWithAccount, @Res() response: Response) {
    try {
      const cookie = this.authService.generateCookieString(false, {
        username: user.username,
      });
      response.setHeader('Set-Cookie', cookie);
      const accountReturn = this.accountService._transform(user);
      return response.send(ResponseObject.success(accountReturn));
    } catch (err) {
      throw err;
    }
  }

  @Post('register')
  async logUp(@Body() data: CreateAccountDTO, @Res() response: Response) {
    try {
      const isExisted = await this.accountService.getByUsername(data.username);
      if (isExisted) {
        throw new BadRequestException(MESSAGES.validate.INPUT_INVALID);
      }
      const passwordEncrypted = await this.authService.generatePassword(
        data.password,
      );
      const account = await this.accountService.create({
        ...data,
        password: passwordEncrypted,
      });
      const cookie = this.authService.generateCookieString(false, {
        username: data.username,
      });
      response.setHeader('Set-Cookie', cookie);
      return response.send(
        ResponseObject.success(this.accountService._transform(account)),
      );
    } catch (err) {
      throw err;
    }
  }

  @Get('logout')
  @UseGuards(CookieStrategy)
  async logout(@Res() response: Response) {
    try {
      const cookie = this.authService.generateCookieString(true);
      response.setHeader('Set-Cookie', cookie);
      return response.send(ResponseObject.success(true));
    } catch (err) {
      throw err;
    }
  }
}
