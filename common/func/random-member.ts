export const randomMember = (
  memberDic: Record<string, string>,
  memberJoin?: string[],
): { id: string; alias: string } => {
  const members = memberJoin
    ? [...Object.keys(memberDic)].filter((mem) => memberJoin.includes(mem))
    : [...Object.keys(memberDic)];
  const memberCount = members.length;
  const keySelected = members[Math.floor(Math.random() * memberCount)];
  return {
    alias: keySelected,
    id: memberDic[keySelected],
  };
};

export const randomMemberByAlias = (memberAliases: string[]): string => {
  const memberCount = memberAliases.length;
  return memberAliases[Math.floor(Math.random() * memberCount)];
};
