import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ENTITY_DESC_LENGTH } from 'common/constants';

export class CreateBacklogDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(ENTITY_DESC_LENGTH)
  description?: string;
}

export class MoveBacklogToIterationDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  iterationId: string;
}
