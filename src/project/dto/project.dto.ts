import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { SearchPaginationDTO } from 'src/app/dto';

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  programId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SearchProjectsDTO extends SearchPaginationDTO {
  @IsString()
  @IsNotEmpty()
  programId: string;
}
