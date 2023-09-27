import { Inject, Injectable } from '@nestjs/common';
import { IMemberService, IMemberResponse } from '../project/interfaces';
import {
  IMemberRepository,
  I_MEMBER_REPOSITORY,
  Member,
  Project,
} from '@ld3v/nqh-shared';

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    @Inject(I_MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  public async findByProject(project: Project): Promise<Member[]> {
    try {
      return await this.memberRepository.getMembersByProjectId(project.id);
    } catch (error) {
      throw error;
    }
  }

  public _transform(member: Member): IMemberResponse {
    return {
      id: member.id,
      accountId: member.account.id,
      displayName: member.account.displayName,
      avatar: member.account.avatar,
      username: member.account.username,
    };
  }

  public _transformMulti(members: Member[]): IMemberResponse[] {
    return members?.map((mem) => this._transform(mem));
  }
}
