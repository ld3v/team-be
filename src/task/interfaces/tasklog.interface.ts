import { Member, TaskLog } from 'src/app/datasource/entities';
import { CreateLogworkDTO } from '../dto';
import { TEntityOptionFields } from 'src/app/datasource/interfaces';
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
