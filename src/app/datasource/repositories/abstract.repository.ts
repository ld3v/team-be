import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';
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
