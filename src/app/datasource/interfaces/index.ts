export * from './account.interface';
export * from './program.interface';
export * from './project.interface';
export * from './iteration.interface';
export * from './backlog.interface';

export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  _updateId(prefix: string, _default?: string): void;
}

export type TTimeRange = [Date, Date];

export type TEntityOptionFields =
  | '_updateId'
  | 'reload'
  | 'recover'
  | 'softRemove'
  | 'save'
  | 'remove'
  | 'hasId';
