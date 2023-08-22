import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProgramDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
