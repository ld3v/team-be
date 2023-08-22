import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-z0-9.]+$/, {
    message:
      'Password just includes lowercase characters, numbers, or underscores',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}
