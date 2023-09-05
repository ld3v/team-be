import { Controller, Get, Query } from '@nestjs/common';
import { APM_MEMBERS } from 'common/constants';
import { randomMember, randomMemberByAlias } from 'common/func';

@Controller('public')
export class PublicController {
  @Get('apm-random-member')
  public getRandomMember(@Query('members') members?: string) {
    if (members && members.trim().split(',').length > 0) {
      const memberAliases = members.trim().split(',');

      return {
        members: memberAliases,
        result: randomMemberByAlias(memberAliases),
      };
    }
    const { alias } = randomMember(APM_MEMBERS);

    return {
      members: Object.keys(APM_MEMBERS),
      result: alias,
    };
  }
}
