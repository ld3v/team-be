import { TAccountPreview } from 'src/account/interfaces';
import { TProgramEntity } from '@ld3v/nqh-shared';
import { TProjectPreview } from 'src/project/interfaces';

export interface IProgramResponse
  extends Omit<TProgramEntity, 'projects' | 'members' | 'participants'> {
  members: TAccountPreview[];
  projects: TProjectPreview[];
  participants: TAccountPreview[];
}

export type TProgramPreview = Pick<
  TProgramEntity,
  'id' | 'name' | 'description'
> & { countMembers: number; countParticipants: number; countProjects: number };
