export const arrayToDic = <T extends { id: string; [key: string]: any }>(
  arr: T[],
): { dic: Record<string, T>; ids: string[] } => {
  const res: Record<string, T> = {};
  const ids: string[] = [];
  arr.forEach((arrItem) => {
    res[arrItem.id] = arrItem;
    ids.push(arrItem.id);
  });

  return {
    dic: res,
    ids,
  };
};
