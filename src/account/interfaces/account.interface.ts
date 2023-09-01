import { TAccountEntity } from 'src/app/datasource/interfaces/account.interface';

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
