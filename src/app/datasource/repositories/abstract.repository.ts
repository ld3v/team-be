import {
  DeepPartial,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { keys, set } from 'lodash';

export type TPaginationOptions = {
  page?: number;
  size?: number;
};

export type TSearchOptions = {
  keyword?: string;
};

export type TPaginationResult<Entity extends ObjectLiteral> = {
  items: Entity[];
  total: number;
};

export const queryByKeywordAndPagination = async <T>(
  _query: SelectQueryBuilder<T>,
  { keyword }: TSearchOptions,
  { page, size }: TPaginationOptions = {},
  queryWhere: string,
): Promise<{
  _query: SelectQueryBuilder<T>;
  items: T[];
  total: number;
}> => {
  if (keyword) {
    _query = _query.andWhere(`( ${queryWhere} )`, { keyword: `%${keyword}%` });
  }
  const total = await _query.getCount();
  if (page !== undefined || size) {
    _query = _query.offset((page || 0) * size).limit(size || 10);
  }

  const items = await _query.getMany();

  return {
    _query,
    items,
    total,
  };
};

export interface IRepository<Entity extends ObjectLiteral> {
  findById(id: string): Promise<Entity | null>;

  findMany(): Promise<Array<Entity>>;

  create(doc: DeepPartial<Entity>): Promise<Entity | null>;

  updateById(id: string, doc: DeepPartial<Entity>): Promise<Entity | null>;

  deleteById(id: string): Promise<boolean | null>;
}

export class AbstractRepository<Entity extends ObjectLiteral>
  implements IRepository<Entity>
{
  protected readonly _repository: Repository<Entity>;

  constructor(baseRepository: Repository<Entity>) {
    this._repository = baseRepository;
  }

  async findById(id): Promise<Entity | null> {
    return await this._repository.findOneBy({ id });
  }

  async findMany(): Promise<Entity[]> {
    return await this._repository.find();
  }

  async create(doc: DeepPartial<Entity>): Promise<Entity> {
    const dataToCreate = this._repository.create(doc);
    return await this._repository.save(dataToCreate);
  }

  async updateById(id: string, doc: DeepPartial<Entity>): Promise<Entity> {
    const foundInstance = await this.findById(id);
    keys(doc).forEach((key) => {
      set(foundInstance, key, doc[key]);
    });

    return await foundInstance.save();
  }

  async deleteById(id: string): Promise<boolean | null> {
    const foundInstance = await this.findById(id);
    if (!foundInstance) {
      return null;
    }
    await this._repository.softDelete(foundInstance);

    return true;
  }
}
