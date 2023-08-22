import { customAlphabet } from 'nanoid';
import { TEXT } from './constants';

const generateId = (prefix: string, _default?: string): string => {
  if (_default) return _default;
  const randomStr = customAlphabet(TEXT)(8);
  return `${prefix}_${randomStr}`;
};

export default generateId;
