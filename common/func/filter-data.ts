export const transformWithCalc = <
  OriginalDataType extends Record<string, any>,
  TAfterDataType,
>(
  dest: OriginalDataType,
  field: keyof OriginalDataType,
  value: TAfterDataType,
) => {
  const preData = dest[field];
  if (preData === undefined) return;
  if (preData) {
    dest[field] = value as OriginalDataType[keyof OriginalDataType];
    return;
  }
  dest[field] = null;
};
