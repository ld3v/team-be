import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsISO8601,
} from 'class-validator';
import { ENTITY_DESC_LENGTH, ENTITY_NAME_LENGTH } from 'common/constants';

export class CreateIterationDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(ENTITY_NAME_LENGTH)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(ENTITY_DESC_LENGTH)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(ENTITY_DESC_LENGTH)
  goal?: string;

  @IsISO8601({ strict: true })
  startAt: string;

  @IsISO8601({ strict: true })
  finishAt: Date;
}

export class SearchProjectsDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
