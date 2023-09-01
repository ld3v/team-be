import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  picId: string;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  timeEstimated: number;
}

export class CreateLogworkDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  timeSpent: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  memberId: string;
}
