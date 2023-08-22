import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class AbstractEntity<Entity> extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<Entity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
