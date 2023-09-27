import { TEntityOptionFields, Member, TaskLog } from '@ld3v/nqh-shared';
import { CreateLogworkDTO } from '../dto';
import { IMemberResponse } from 'src/project/interfaces';

export type TTaskLogEntity = Omit<TaskLog, TEntityOptionFields>;

export interface ICreateTaskLogInput
  extends Omit<CreateLogworkDTO, 'memberId'> {
  member: Member;
}

export interface ITaskLogResponse
  extends Pick<TTaskLogEntity, 'id' | 'message' | 'timeSpent' | 'date'> {
  member: IMemberResponse;
}
