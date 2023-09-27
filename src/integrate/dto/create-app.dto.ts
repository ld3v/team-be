import { EAppIntegrate } from '@ld3v/nqh-shared';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAppDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EAppIntegrate)
  @IsString()
  app: EAppIntegrate;
}
