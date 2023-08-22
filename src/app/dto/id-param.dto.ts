import { IsString, IsNotEmpty } from 'class-validator';

export class IdDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
