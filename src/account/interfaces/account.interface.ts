import { TAccountEntity } from '@ld3v/nqh-shared';

export interface IAccountResponse
  extends Omit<
    TAccountEntity,
    'password' | 'memberOfPrograms' | 'participantOfPrograms'
  > {
  memberOfProgramIds: string[];
  participantOfProgramIds: string[];
}

export type TAccountPreview = Pick<
  TAccountEntity,
  'id' | 'username' | 'avatar' | 'displayName'
>;
