import { TAccountPreview } from 'src/account/interfaces';
import { TProjectMemberEntity } from 'src/app/datasource/interfaces';

export interface IMemberResponse extends Omit<TProjectMemberEntity, 'program'> {
  programId: string;
}

export type TMemberPreview = Pick<TProjectMemberEntity, 'id'> & {
  account: TAccountPreview;
  hoursSpent: number;
};
