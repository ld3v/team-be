import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
  IsEnum,
} from 'class-validator';

export enum SPGoogleEventAttendeeResStatusEnum {
  UNCONFIRMED = 'needsAction',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
}

export class CreateSPGEventDTO {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  recurringId?: string;

  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  eventLink?: string;

  @IsString()
  startedAt: string; // ISO8601

  @IsString()
  finishedAt: string; // ISO8601

  @ValidateNested()
  @Type(() => AttendeeDTO)
  attendees: AttendeeDTO[];

  @IsBoolean()
  isPrivate: boolean;
}

export class CreateSPGEventsDTO {
  @ValidateNested()
  @Type(() => CreateSPGEventDTO)
  events: CreateSPGEventDTO[];
}

class AttendeeDTO {
  @IsString()
  username: string;

  @IsEnum(SPGoogleEventAttendeeResStatusEnum)
  status: SPGoogleEventAttendeeResStatusEnum;
}
