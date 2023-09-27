import { TEntityOptionFields, Member, Project } from '@ld3v/nqh-shared';

export const I_MEMBER_SERVICE = 'I-MEMBER-SERVICE';

type TMemberEntity = Omit<Member, TEntityOptionFields>;

export interface IMemberResponse extends Pick<TMemberEntity, 'id'> {
  accountId: string;
  displayName: string;
  username: string;
  avatar: string;
}

export interface IMemberService {
  findByProject(project: Project): Promise<Member[]>;
  // Transform data
  _transform(mem: Member): IMemberResponse;
  _transformMulti(mem: Member[]): IMemberResponse[];
}
