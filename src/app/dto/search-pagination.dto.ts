import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class SearchPaginationDTO {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number;
}
