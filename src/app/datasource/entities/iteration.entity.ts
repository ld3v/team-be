import { Entity, Column, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import generateId from 'common/gen-id';
import { AbstractEntity, Project } from '.';
import { BacklogItem } from './backlog-item.entity';

@Entity({ name: 'iteration' })
export class Iteration extends AbstractEntity<Iteration> {
  @Column()
  name: string;

  @Column({
    name: 'description',
    default: '',
  })
  description: string;

  @Column({
    name: 'goal',
    default: '',
  })
  goal: string;

  @Column({
    name: 'review',
    default: '',
  })
  review: string;

  @Column({
    name: 'startAt',
    nullable: false,
  })
  startAt: Date;

  @Column({
    name: 'finishAt',
    nullable: false,
  })
  finishAt: Date;

  @Column({
    name: 'isClosed',
    default: false,
  })
  isClosed: boolean;

  // Relations
  @ManyToOne(() => Project, (prj) => prj.iterations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  project: Project;

  @OneToMany(() => BacklogItem, (bli) => bli.iteration)
  backlog: BacklogItem[];

  // Actions
  @BeforeInsert()
  _updateId() {
    this.id = generateId('ITR', this.id);
  }
}
