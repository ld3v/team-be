import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModule } from 'src/account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { I_AUTH_SERVICE } from './interfaces';
import { JWTStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    AccountModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN_DATES: Joi.number().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRES_IN_DATES')}d`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: I_AUTH_SERVICE,
      useClass: AuthService,
    },
    LocalStrategy,
    JWTStrategy,
  ],
  exports: [I_AUTH_SERVICE],
})
export class AuthModule {}
